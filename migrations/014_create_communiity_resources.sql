CREATE TABLE community_resources (
  id INTEGER PRIMARY KEY,
  city_id INTEGER NOT NULL,
  zone_id INTEGER,
  title TEXT NOT NULL,
  category TEXT NOT NULL,   -- food, housing, bills, health, legal, etc.
  description TEXT,
  address TEXT,
  apply_url TEXT,
  source_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(city_id) REFERENCES cities(id),
  FOREIGN KEY(zone_id) REFERENCES zones(id)
);
