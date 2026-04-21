import { scrapeRSS } from "../scrapers/rss.js";
import { scrapeHTML } from "../scrapers/html.js";
import { scrapeAPI } from "../scrapers/api.js";
import { scrapeJobs } from "../scrapers/jobs.js";
import { scrapeEvents } from "../scrapers/events.js";
import { scrapeResources } from "../scrapers/resources.js";
import { saveArticle, saveJob, saveEvent, saveResource } from "../db/save.js";

export default {
  async fetch(request, env) {
    try {
      const payload = await request.json();
      const { source } = payload;

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

        default:
          throw new Error(`Unknown source type: ${source.type}`);
      }

      // Save to DB
      for (const item of items) {
        if (source.type === "rss" || source.type === "html" || source.type === "api") {
          await saveArticle(env.DB, item);
        } else if (source.type === "jobs") {
          await saveJob(env.DB, item);
        } else if (source.type === "events") {
          await saveEvent(env.DB, item);
        } else if (source.type === "resources") {
          await saveResource(env.DB, item);
        }
      }

      return new Response(JSON.stringify({ success: true, count: items.length }), {
        headers: { "Content-Type": "application/json" }
      });

    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
