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

// C.2
app.get('/artists/:id/albums', (req, res) => {
    const stmt = db.prepare(
        "SELECT * FROM album WHERE artistID=?"
    );
    res.json(stmt.all(req.params.id));
});

// C.3
app.get('/tracks/long', (req, res) => {
    const stmt = db.prepare(
        "SELECT * FROM track INNER JOIN album ON track.albumID = album.albumID WHERE track.milliseconds > 300000 "
    );
    res.json(stmt.all());
});

// C.4
app.get('/genres/:id/stats', (req, res) => {
    const stmt = db.prepare(
        "SELECT COUNT(*), AVG(track.milliseconds), genre.name FROM track INNER JOIN genre ON track.genreID = genre.genreID WHERE track.genreID = ?"
    );
    res.json(stmt.all(req.params.id));
})

// C.5
app.get('/playlists', (req, res) => {
    const stmt = db.prepare(
        "SELECT * FROM playlist"
    );
    res.json(stmt.all());
})

app.post('/playlists', (req, res) => {
    const insert = db.prepare("INSERT INTO playlist (Name) VALUES (?)");
    const result = insert.run(req.body.name);

    res.type('text').send(result.lastInsertRowid);
});

// C.6

app.delete('/playlists/:id', (req, res) => {
    const del = db.prepare("DELETE FROM playlist WHERE playlist.playlistID = ?");

    const result = del.run(req.params.id);

    if (result.changes > 0){
        res.type('text').send("Playlist with the ID " + req.params.id + "was successfully deleted.");
    }else {
        res.type('text').send("Playlist with the ID was not found.");
    }
});

// D.1

app.get('/invoices/top-customers', (req, res) => {
    const stmt = db.prepare(`
        SELECT *, SUM(Invoice.Total)
        FROM customer 
        INNER JOIN invoice ON customer.customerID = invoice.customerID 
        GROUP BY invoice.customerID 
        ORDER BY SUM(Invoice.Total) DESC 
        LIMIT 5 `
    );

    res.json(stmt.all());
})