import { saveArticle, saveJob, saveEvent, saveResource } from "../db/save.js";

export default {
  async queue(batch, env, ctx) {
    for (const message of batch.messages) {
      ctx.waitUntil(handleNormalizeJob(message, env));
    }
  }
};

async function handleNormalizeJob(message, env) {
  const db = env.DB;
  const { type, items } = message.body;

  if (!items || items.length === 0) return;

  for (const item of items) {
    if (type === "rss" || type === "html" || type === "api") {
      await normalizeArticle(db, item);
    } else if (type === "jobs") {
      await normalizeJob(db, item);
    } else if (type === "events") {
      await normalizeEvent(db, item);
    } else if (type === "resources") {
      await normalizeResource(db, item);
    }
  }
}

async function normalizeArticle(db, item) {
  const existing = await db
    .prepare("SELECT id FROM articles WHERE hash = ? LIMIT 1")
    .bind(item.hash)
    .first();
  if (existing) return;
  await saveArticle(db, item);
}

async function normalizeJob(db, item) {
  const existing = await db
    .prepare(
      "SELECT id FROM jobs WHERE title = ? AND company = ? AND city_id = ? LIMIT 1"
    )
    .bind(item.title, item.company || "", item.city_id)
    .first();
  if (existing) return;
  await saveJob(db, item);
}

async function normalizeEvent(db, item) {
  const existing = await db
    .prepare(
      "SELECT id FROM community_events WHERE title = ? AND event_date = ? AND city_id = ? LIMIT 1"
    )
    .bind(item.title, item.event_date || "", item.city_id)
    .first();
  if (existing) return;
  await saveEvent(db, item);
}

async function normalizeResource(db, item) {
  const existing = await db
    .prepare(
      "SELECT id FROM community_resources WHERE title = ? AND city_id = ? LIMIT 1"
    )
    .bind(item.title, item.city_id)
    .first();
  if (existing) return;
  await saveResource(db, item);
}
