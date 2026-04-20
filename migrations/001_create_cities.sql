CREATE TABLE cities (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  population INTEGER,
  status TEXT DEFAULT 'active'
);
