const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

//  Encryption setup
const algorithm = 'aes-256-cbc';

function deriveKey(secret) {
  return crypto.createHash('sha256').update(secret).digest();
}

function decryptData(encrypted, timekey) {
  const key = deriveKey(timekey);
  const iv = Buffer.from(encrypted.iv, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted.content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

//  Unified handler
function processRequest(req, res, serviceType) {
  let [
    encryptedField,
    timekey,
    studentName,
    studentEmail,
    persona1,
    persona2,
    persona3,
    persona4,
    selectedDegreeNo,
    degreePercentSet
   ] = req.body;

  let decryptedPass;
  try {
    decryptedPass = decryptData({ content: encryptedField, iv: 'your_iv_here' }, studentEmail + "INSERT INTO TABLE f");
  } catch (err) {
    console.error(`Decryption failed for ${studentEmail}:`, err.message);
    return res.status(400).send('Decryption failed');
  }

  console.log(`${serviceType} request received for ${studentEmail}`);
  console.log('Decrypted password: ${decryptedPass}');
  console.log(`Degree: ${selectedDegreeNo}, Personas:`, [persona1, persona2, persona3, persona4]);

  // Simulate success
  res.status(200).send(`${serviceType} successful`);
}

//  Routes
app.post('/register', (req, res) => processRequest(req, res, 'Register'));
app.post('/update', (req, res) => processRequest(req, res, 'Update'));
app.post('/login', (req, res) => processRequest(req, res, 'Login'));

//  Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
