CREATE TABLE hood_name_proposals (
  id INTEGER PRIMARY KEY,
  zone_id INTEGER NOT NULL,
  proposed_name TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'pending',  -- pending, approved, rejected
  FOREIGN KEY(zone_id) REFERENCES zones(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);
