INSERT INTO users (username, password_hash) VALUES ('admin', '$2a$10$9Q71JBCk54BJmbx7BLD/ou0DqAmPcyhvMckvtfJHkqBFk.Xnb8Gli') ON CONFLICT (username) DO NOTHING;

INSERT INTO categories (name, slug, sort_order) VALUES 
  ('Generators', 'generators', 1),
  ('Engine Parts', 'engine-parts', 2),
  ('Engines', 'engines', 3)
ON CONFLICT (slug) DO NOTHING;
