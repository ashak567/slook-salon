const db = require('./db');

db.all("SELECT count(*) as count FROM reviews", [], (err, rows) => {
    if (err) console.error(err);
    else console.log("Reviews in DB:", rows[0].count);
    db.close();
});
