PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (
	username TEXT PRIMARY KEY,
   	password TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS articles (
    title TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    html BLOB NOT NULL,
    author INTEGER NOT NULL,
    FOREIGN KEY (author) REFERENCES users (username)
);
