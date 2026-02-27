import Database from 'better-sqlite3';
import path from 'path';
const db = new Database('nearhelp.db');
// Enable foreign keys
db.pragma('foreign_keys = ON');
// Initialize tables
export const initDb = () => {
    // Users Table
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      skills TEXT, -- Comma separated skills
      rating REAL DEFAULT 5.0,
      false_alerts INTEGER DEFAULT 0,
      suspended INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
    // SOS Alerts Table
    db.exec(`
    CREATE TABLE IF NOT EXISTS sos_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      radius INTEGER NOT NULL,
      status TEXT DEFAULT 'active', -- active, resolved, cancelled
      is_anonymous INTEGER DEFAULT 0,
      ai_guidance TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      resolved_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
    // Responders Table
    db.exec(`
    CREATE TABLE IF NOT EXISTS responders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sos_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      status TEXT DEFAULT 'responding', -- responding, arrived, completed
      latitude REAL,
      longitude REAL,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sos_id) REFERENCES sos_alerts(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
    // Chat Messages Table
    db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sos_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sos_id) REFERENCES sos_alerts(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
    // Community Resources (Static for now)
    db.exec(`
    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL, -- AED, Fire Extinguisher, Hospital, Police
      name TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL
    )
  `);
    console.log('Database initialized successfully');
};
export default db;
//# sourceMappingURL=db.js.map