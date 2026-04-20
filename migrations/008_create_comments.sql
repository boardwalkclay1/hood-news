CREATE TABLE comments (
  id INTEGER PRIMARY KEY,
  article_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(article_id) REFERENCES articles(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);
