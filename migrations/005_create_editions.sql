CREATE TABLE editions (
  id INTEGER PRIMARY KEY,
  city_id INTEGER NOT NULL,
  zone_id INTEGER,
  date TEXT NOT NULL,
  json_payload TEXT NOT NULL,
  pdf_r2_key TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(city_id) REFERENCES cities(id),
  FOREIGN KEY(zone_id) REFERENCES zones(id)
);
