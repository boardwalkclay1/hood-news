export default {
  // Cloudflare Cron Trigger
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runScheduler(env));
  }
};

async function runScheduler(env) {
  const db = env.DB;

  // Get all active sources
  const { results } = await db
    .prepare("SELECT id, city_id, zone_id, url, type FROM sources WHERE status = 'active'")
    .all();

  if (!results || results.length === 0) return;

  for (const source of results) {
    const job = {
      source: {
        id: source.id,
        city_id: source.city_id,
        zone_id: source.zone_id,
        url: source.url,
        type: source.type
      }
    };

    await env.SCRAPE_QUEUE.send(job);
  }
}
