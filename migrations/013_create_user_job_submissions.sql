CREATE TABLE user_job_submissions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  city_id INTEGER NOT NULL,
  zone_id INTEGER,
  title TEXT NOT NULL,
  company TEXT,
  apply_url TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'pending',
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(city_id) REFERENCES cities(id),
  FOREIGN KEY(zone_id) REFERENCES zones(id)
);
