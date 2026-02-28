const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'salon.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    // Services Table
    db.run(`CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      serviceName TEXT NOT NULL,
      category TEXT NOT NULL,
      subCategory TEXT,
      description TEXT,
      priceMin REAL NOT NULL,
      priceMax REAL,
      duration INTEGER NOT NULL,
      activeStatus INTEGER DEFAULT 1
    )`);

    // Appointments Table
    db.run(`CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerName TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      serviceId INTEGER NOT NULL,
      stylistName TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      totalAmount REAL DEFAULT 0,
      paymentStatus TEXT DEFAULT 'Pending',
      paymentMethod TEXT DEFAULT 'PayAtSalon',
      paymentId TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (serviceId) REFERENCES services(id)
    )`, () => {
      // Attempt graceful alters for existing structures (ignores errors if columns already exist)
      db.run(`ALTER TABLE appointments ADD COLUMN totalAmount REAL DEFAULT 0`, () => { });
      db.run(`ALTER TABLE appointments ADD COLUMN paymentMethod TEXT DEFAULT 'PayAtSalon'`, () => { });
      db.run(`ALTER TABLE appointments ADD COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP`, () => { });
    });

    // Create unique index to prevent double booking
    db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_date_time ON appointments(date, time)`);

    // Reviews Table
    db.run(`CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reviewerName TEXT NOT NULL,
      rating INTEGER NOT NULL,
      reviewText TEXT,
      reviewDate TEXT,
      profilePhotoUrl TEXT
    )`);

    // Staff Table
    db.run(`CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )`);
  });
}

module.exports = db;
