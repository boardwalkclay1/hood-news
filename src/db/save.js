// src/db/save.js

export async function saveArticle(db, item) {
  await db
    .prepare(
      `INSERT INTO articles 
        (source_id, city_id, zone_id, title, body, url, image_url, published_at, hash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      item.source_id || null,
      item.city_id || null,
      item.zone_id || null,
      item.title || "",
      item.body || "",
      item.url || "",
      item.image_url || "",
      item.published_at || "",
      item.hash || ""
    )
    .run();
}

export async function saveJob(db, item) {
  await db
    .prepare(
      `INSERT INTO jobs 
        (city_id, zone_id, title, company, description, url, posted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      item.city_id || null,
      item.zone_id || null,
      item.title || "",
      item.company || "",
      item.description || "",
      item.url || "",
      item.posted_at || ""
    )
    .run();
}

export async function saveEvent(db, item) {
  await db
    .prepare(
      `INSERT INTO community_events 
        (city_id, zone_id, title, description, event_date, address, url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      item.city_id || null,
      item.zone_id || null,
      item.title || "",
      item.description || "",
      item.event_date || "",
      item.address || "",
      item.url || ""
    )
    .run();
}

export async function saveResource(db, item) {
  await db
    .prepare(
      `INSERT INTO community_resources 
        (city_id, zone_id, title, category, description, url)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(
      item.city_id || null,
      item.zone_id || null,
      item.title || "",
      item.category || "",
      item.description || "",
      item.url || ""
    )
    .run();
}
