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

/** Part C */ 

// C.1
app.get('/artists', (req, res) => {
    const stmt = db.prepare(
        "SELECT * FROM artist"
    );
    res.json(stmt.all());
});

app.get('/artists/:id/albums', (req, res) => {
    const stmt = db.prepare(
        "SELECT * FROM album WHERE artistID=?"
    );
    res.json(stmt.all(req.params.id));
});

app.get('/tracks/long', (req, res) => {
    const stmt = db.prepare(
        "SELECT * FROM track INNER JOIN album ON track.albumID = album.albumID WHERE track.milliseconds > 300000 "
    )
    res.json(stmt.all());
});