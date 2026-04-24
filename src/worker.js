// =========================
// SCRAPERS (MATCHES YOUR REAL FOLDERS)
// =========================
import { scrapeRSS } from "../scrapers/parsers/rssParsers.js";
import { scrapeHTML } from "../scrapers/parsers/htmlParser.js";
import { scrapeAPI } from "../scrapers/parsers/apiParser.js";
import { scrapeJobs } from "../scrapers/parsers/jobParser.js";
import { scrapeEvents } from "../scrapers/parsers/eventParser.js";
import { scrapeResources } from "../scrapers/parsers/resourcesParcer.js";

// =========================
// NORMALIZERS (MATCHES YOUR REAL FOLDERS)
// =========================
import { normalizeArticle } from "../scrapers/handlers/normalizeArticle.js";
import { normalizeEvent } from "../scrapers/handlers/normalizeEvent.js";
import { normalizeResource } from "../scrapers/handlers/normalizeResource.js";
import { normalizeJob } from "../scrapers/handlers/normalizejob.js";

// =========================
// DB HELPERS
// =========================
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
  // =========================
  // API ROUTES
  // =========================
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

  // =========================
  // CRON SCHEDULER
  // =========================
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runScheduler(env));
  },

  // =========================
  // QUEUE CONSUMER
  // =========================
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

// =========================
// SCHEDULER LOGIC
// =========================
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

// =========================
// SCRAPER LOGIC
// =========================
async function handleScrape(source, env) {
  let rawItems = [];

  switch (source.type) {
    case "rss":
      rawItems = await scrapeRSS(source.url, source);
      break;
    case "html":
      rawItems = await scrapeHTML(source.url, source);
      break;
    case "api":
      rawItems = await scrapeAPI(source.url, source);
      break;
    case "jobs":
      rawItems = await scrapeJobs(source.url, source);
      break;
    case "events":
      rawItems = await scrapeEvents(source.url, source);
      break;
    case "resources":
      rawItems = await scrapeResources(source.url, source);
      break;
  }

  if (rawItems.length > 0) {
    await env.NORMALIZE_QUEUE.send({
      type: "normalize",
      source_type: source.type,
      items: rawItems
    });
  }
}

// =========================
// NORMALIZER LOGIC
// =========================
async function handleNormalize(body, env) {
  const db = env.DB;

  for (const item of body.items) {
    let normalized;

    switch (body.source_type) {
      case "rss":
      case "html":
      case "api":
        normalized = normalizeArticle(item);
        await saveArticle(db, normalized);
        break;

      case "jobs":
        normalized = normalizeJob(item);
        await saveJob(db, normalized);
        break;

      case "events":
        normalized = normalizeEvent(item);
        await saveEvent(db, normalized);
        break;

      case "resources":
        normalized = normalizeResource(item);
        await saveResource(db, normalized);
        break;
    }
  }
}

// =========================
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
