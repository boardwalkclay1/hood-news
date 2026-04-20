CREATE TABLE sources (
  id INTEGER PRIMARY KEY,
  city_id INTEGER NOT NULL,
  zone_id INTEGER,
  url TEXT NOT NULL,
  type TEXT NOT NULL,   -- rss, html, api, youtube, reddit, etc.
  status TEXT DEFAULT 'active',
  last_success_at TEXT,
  fail_count INTEGER DEFAULT 0,
  FOREIGN KEY(city_id) REFERENCES cities(id),
  FOREIGN KEY(zone_id) REFERENCES zones(id)
);
