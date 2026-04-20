CREATE TABLE articles (
  id INTEGER PRIMARY KEY,
  source_id INTEGER NOT NULL,
  city_id INTEGER NOT NULL,
  zone_id INTEGER,
  title TEXT NOT NULL,
  body TEXT,
  url TEXT NOT NULL,
  published_at TEXT,
  hash TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(source_id) REFERENCES sources(id),
  FOREIGN KEY(city_id) REFERENCES cities(id),
  FOREIGN KEY(zone_id) REFERENCES zones(id)
);
