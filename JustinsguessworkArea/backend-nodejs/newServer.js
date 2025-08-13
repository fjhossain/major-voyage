const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import service handlers
const { registerNowNew } = require('./newaddstudent');
const { loginNowNew } = require('./newLogin');
const { updateNowNew } = require('./newUpdateStudent');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

//  Unified service router
app.post('/submit', async (req, res) => {
  const { service } = req.body;

  try {
    switch (service) {
      case 'create_account':
        return registerNowNew(req, res);
      case 'login':
        return loginNowNew(req, res);
      case 'update':
        return updateNowNew(req, res);
      default:
        return res.status(400).json({ error: 'Unsupported service type' });
    }
  } catch (err) {
    console.error(`Unhandled error in ${service}:`, err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//  Server start
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
