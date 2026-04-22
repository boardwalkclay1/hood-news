// src/db/queries.js

export async function getCities(db) {
  const { results } = await db
    .prepare("SELECT * FROM cities ORDER BY population DESC")
    .all();
  return results;
}

export async function getCity(db, id) {
  return await db
    .prepare("SELECT * FROM cities WHERE id = ? LIMIT 1")
    .bind(id)
    .first();
}

export async function getZones(db, cityId) {
  const { results } = await db
    .prepare("SELECT * FROM zones WHERE city_id = ? ORDER BY name ASC")
    .bind(cityId)
    .all();
  return results;
}

export async function getEditions(db, cityId, zoneId) {
  const { results } = await db
    .prepare(
      `SELECT * FROM editions 
       WHERE city_id = ? AND (zone_id = ? OR zone_id IS NULL)
       ORDER BY published_at DESC`
    )
    .bind(cityId, zoneId)
    .all();
  return results;
}

export async function getArticles(db, cityId, limit = 50) {
  const { results } = await db
    .prepare(
      `SELECT * FROM articles 
       WHERE city_id = ?
       ORDER BY published_at DESC
       LIMIT ?`
    )
    .bind(cityId, limit)
    .all();
  return results;
}

export async function getJobs(db, cityId, zoneId) {
  const { results } = await db
    .prepare(
      `SELECT * FROM jobs 
       WHERE city_id = ? AND (zone_id = ? OR zone_id IS NULL)
       ORDER BY posted_at DESC`
    )
    .bind(cityId, zoneId)
    .all();
  return results;
}

export async function getEvents(db, cityId, zoneId) {
  const { results } = await db
    .prepare(
      `SELECT * FROM community_events 
       WHERE city_id = ? AND (zone_id = ? OR zone_id IS NULL)
       ORDER BY event_date ASC`
    )
    .bind(cityId, zoneId)
    .all();
  return results;
}

export async function getResources(db, cityId, zoneId) {
  const { results } = await db
    .prepare(
      `SELECT * FROM community_resources 
       WHERE city_id = ? AND (zone_id = ? OR zone_id IS NULL)
       ORDER BY title ASC`
    )
    .bind(cityId, zoneId)
    .all();
  return results;
}
