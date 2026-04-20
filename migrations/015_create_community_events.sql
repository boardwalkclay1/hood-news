CREATE TABLE community_events (
  id INTEGER PRIMARY KEY,
  city_id INTEGER NOT NULL,
  zone_id INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  event_date TEXT,
  address TEXT,
  event_url TEXT,
  source_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(city_id) REFERENCES cities(id),
  FOREIGN KEY(zone_id) REFERENCES zones(id)
);
