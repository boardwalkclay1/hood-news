CREATE TABLE zones (
  id INTEGER PRIMARY KEY,
  city_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'city',   -- city, neighborhood, zip, custom
  lat REAL,
  lng REAL,
  FOREIGN KEY(city_id) REFERENCES cities(id)
);
