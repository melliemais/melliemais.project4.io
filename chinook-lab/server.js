// Part B

const express = require("express");
const { DatabaseSync } = require("node:sqlite");

const db = new DatabaseSync("./Chinook_Sqlite.sqlite");
const app = express();
app.use(express.json());

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

app.get('/tables', (req, res) => {
    const stmt = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    );
    res.json(stmt.all());
});

// Part C

app.get('/artists', (req, res) => {
    const stmt = db.prepare(
        "SELECT * FROM artist"
    );
    res.json(stmt.all());
});