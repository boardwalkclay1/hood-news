import { scrapeRSS } from "../scrapers/rss.js";
import { scrapeHTML } from "../scrapers/html.js";
import { scrapeAPI } from "../scrapers/api.js";
import { scrapeJobs } from "../scrapers/jobs.js";
import { scrapeEvents } from "../scrapers/events.js";
import { scrapeResources } from "../scrapers/resources.js";

export default {
  async queue(batch, env, ctx) {
    for (const message of batch.messages) {
      ctx.waitUntil(handleScrapeJob(message, env));
    }
  }
};

async function handleScrapeJob(message, env) {
  const { source } = message.body;
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

  if (!items || items.length === 0) return;

  await env.NORMALIZE_QUEUE.send({
    type: source.type,
    items
  });
}
