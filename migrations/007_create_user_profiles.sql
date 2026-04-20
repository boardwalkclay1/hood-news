CREATE TABLE user_profiles (
  user_id INTEGER PRIMARY KEY,
  bio TEXT,
  home_city_id INTEGER,
  home_zone_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(home_city_id) REFERENCES cities(id),
  FOREIGN KEY(home_zone_id) REFERENCES zones(id)
);
