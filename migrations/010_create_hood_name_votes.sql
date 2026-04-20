CREATE TABLE hood_name_votes (
  id INTEGER PRIMARY KEY,
  proposal_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  vote INTEGER NOT NULL,  -- 1 = yes, 0 = no
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(proposal_id, user_id),
  FOREIGN KEY(proposal_id) REFERENCES hood_name_proposals(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);
