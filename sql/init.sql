CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  publicationYear INTEGER NOT NULL,
  publisher TEXT,
  genre TEXT,
  acquisitionDate TEXT,
  pageCount INTEGER,
  description TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT
);
