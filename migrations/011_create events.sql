CREATE TABLE events (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  city_id INTEGER,
  zone_id INTEGER,
  edition_id INTEGER,
  event_type TEXT NOT NULL,  -- view, download, purchase, comment, vote
  amount REAL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(city_id) REFERENCES cities(id),
  FOREIGN KEY(zone_id) REFERENCES zones(id),
  FOREIGN KEY(edition_id) REFERENCES editions(id)
);
