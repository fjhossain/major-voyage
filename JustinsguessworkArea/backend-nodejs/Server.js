const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const handlePacket  = require('../backend-nodejs/serviceRouter')
const app = express();
const PORT = 3306;
const bodyParser = require('body-parser');

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

app.use(bodyParser.json());

app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/packet', (req, res) => {
  const jsonData = req.body;

  try {
    handlePacket(jsonData); // Pass to service router
    res.status(200).send({ message: 'Packet received and processed.' });
  } catch (err) {
    console.error('Error handling packet:', err);
    res.status(500).send({ error: 'Failed to process packet.' });
  }
});

app.listen(PORT, () => {
    const awake = true;
    console.log('server running at http://localhost!{PORT}');
})