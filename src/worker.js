import { scrapeRSS } from "./scrapers/rss.js";
import { scrapeHTML } from "./scrapers/html.js";
import { scrapeAPI } from "./scrapers/api.js";
import { scrapeJobs } from "./scrapers/jobs.js";
import { scrapeEvents } from "./scrapers/events.js";
import { scrapeResources } from "./scrapers/resources.js";

import {
  saveArticle,
  saveJob,
  saveEvent,
  saveResource
} from "./db/save.js";

import {
  getCities,
  getCity,
  getZones,
  getEditions,
  getArticles,
  getJobs,
  getEvents,
  getResources
} from "./db/queries.js";

export default {
  // ============================================================
  // API ROUTES
  // ============================================================
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const db = env.DB;

    try {
      if (path === "/api/cities") return json(await getCities(db));
      if (path.startsWith("/api/cities/")) {
        const id = path.split("/").pop();
        return json(await getCity(db, id));
      }
      if (path === "/api/zones") {
        return json(await getZones(db, url.searchParams.get("city_id")));
      }
      if (path === "/api/editions") {
        return json(
          await getEditions(
            db,
            url.searchParams.get("city_id"),
            url.searchParams.get("zone_id")
          )
        );
      }
      if (path === "/api/articles") {
        return json(
          await getArticles(db, url.searchParams.get("city_id"), 50)
        );
      }
      if (path === "/api/jobs") {
        return json(
          await getJobs(
            db,
            url.searchParams.get("city_id"),
            url.searchParams.get("zone_id")
          )
        );
      }
      if (path === "/api/events") {
        return json(
          await getEvents(
            db,
            url.searchParams.get("city_id"),
            url.searchParams.get("zone_id")
          )
        );
      }
      if (path === "/api/resources") {
        return json(
          await getResources(
            db,
            url.searchParams.get("city_id"),
            url.searchParams.get("zone_id")
          )
        );
      }

      return new Response("Not found", { status: 404 });
    } catch (err) {
      return json({ error: err.message }, 500);
    }
  },

  // ============================================================
  // CRON SCHEDULER
  // ============================================================
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runScheduler(env));
  },

  // ============================================================
  // QUEUE CONSUMER (SCRAPER + NORMALIZER)
  // ============================================================
  async queue(batch, env, ctx) {
    for (const msg of batch.messages) {
      const body = msg.body;

      if (body.type === "scrape") {
        ctx.waitUntil(handleScrape(body.source, env));
      }

      if (body.type === "normalize") {
        ctx.waitUntil(handleNormalize(body, env));
      }
    }
  }
};

// ============================================================
// SCHEDULER LOGIC
// ============================================================
async function runScheduler(env) {
  const db = env.DB;

  const { results } = await db
    .prepare("SELECT * FROM sources WHERE status = 'active'")
    .all();

  for (const source of results) {
    await env.SCRAPE_QUEUE.send({
      type: "scrape",
      source
    });
  }
}

// ============================================================
// SCRAPER LOGIC
// ============================================================
async function handleScrape(source, env) {
  let items = [];

  switch (source.type) {
    case "rss":
      items = await scrapeRSS(source.url, source);
      break;
    case "html":
      items = await scrapeHTML(source.url, source);
      break;
    case "api":
      items = await scrapeAPI(source.url, source);
      break;
    case "jobs":
      items = await scrapeJobs(source.url, source);
      break;
    case "events":
      items = await scrapeEvents(source.url, source);
      break;
    case "resources":
      items = await scrapeResources(source.url, source);
      break;
  }

  if (items.length > 0) {
    await env.NORMALIZE_QUEUE.send({
      type: "normalize",
      source_type: source.type,
      items
    });
  }
}

// ============================================================
// NORMALIZER LOGIC
// ============================================================
async function handleNormalize(body, env) {
  const db = env.DB;

  for (const item of body.items) {
    if (
      body.source_type === "rss" ||
      body.source_type === "html" ||
      body.source_type === "api"
    ) {
      await saveArticle(db, item);
    }

    if (body.source_type === "jobs") {
      await saveJob(db, item);
    }

    if (body.source_type === "events") {
      await saveEvent(db, item);
    }

    if (body.source_type === "resources") {
      await saveResource(db, item);
    }
  }
}

// ============================================================
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
