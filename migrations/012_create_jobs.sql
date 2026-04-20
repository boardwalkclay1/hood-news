CREATE TABLE jobs (
  id INTEGER PRIMARY KEY,
  city_id INTEGER NOT NULL,
  zone_id INTEGER,
  title TEXT NOT NULL,
  company TEXT,
  description TEXT,
  apply_url TEXT NOT NULL,
  source_url TEXT,
  posted_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(city_id) REFERENCES cities(id),
  FOREIGN KEY(zone_id) REFERENCES zones(id)
);
