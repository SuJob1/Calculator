const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const app = express();
app.use(cors());
const db = new sqlite3.Database('calculations.db');

app.use(bodyParser.json());

// Initialize the database
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS calculations (formula TEXT, result TEXT)");
});

// Save the calculation result to the database
app.post('/save', (req, res) => {
    const formula = req.body.formula;
    const result = req.body.result;
    db.run("INSERT INTO calculations (formula, result) VALUES (?, ?)", [formula, result], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true });
    });
});

// Obtain the latest 10 calculation results
app.get('/recent', (req, res) => {
    db.all("SELECT formula, result FROM calculations ORDER BY rowid DESC LIMIT 10", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

