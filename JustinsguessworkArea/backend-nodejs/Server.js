const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')

const app = express();
const PORT = 3306;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'CSI4999App',
    password: 'thiscsi4999(r@p',
    database: 'csi_4999projectset'
});

db.connect(err => {
    if (err) {
        console.error('DBconnection failed:', err)
        return
    }
    console.log('MySQL connected!')
});

app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log('server running at http://localhost!{PORT}');
})