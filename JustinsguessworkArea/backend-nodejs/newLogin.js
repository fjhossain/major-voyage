const crypto = require('crypto');
const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3307;

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
    console.error('DB connection failed:', err);
    return;
  }
  console.log('MySQL connected!');
});

const algorithm = 'aes-256-cbc';

function deriveKey(secret) {
  return crypto.createHash('sha256').update(secret).digest();
}

function decryptData(encrypted, keySource) {
  const key = deriveKey(keySource.toString());
  const iv = Buffer.from(encrypted.iv, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted.content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function encryptData(data, keySource) {
  const key = deriveKey(keySource.toString());
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv: iv.toString('hex'),
    content: encrypted
  };
}

function sendEncryptedError(res, timestamp, message, reasonCode) {
  const reasonMap = {
    0: 'no user',
    1: 'wrong pass',
    2: 'decryption/encryption failure'
  };
  const reasonStr = reasonMap[reasonCode] || 'unknown';

  const response = {
    status: 'error',
    message,
    timestamp
  };
  const encrypted = encryptData(JSON.stringify(response), timestamp);
  res.status(401).json({
    success: false,
    timestamp,
    iv: encrypted.iv,
    content: encrypted.content,
    reason: reasonStr
  });
}

function loginNowNew(req, res) {
  const { studentEmail, encryptedField, timekey } = req.body;
  const now = Date.now();
  const secret = studentEmail + 'Insert into table f';

  let decryptedPassword;
  try {
    decryptedPassword = decryptData(encryptedField, secret);
  } catch (err) {
    return sendEncryptedError(res, now, 'Password decryption failed', 2);
  }

  const encryptedForComparison = encryptData(decryptedPassword, secret).content;

  const query = 'SELECT * FROM students WHERE STUDENT_EMAIL = ?';
  db.query(query, [studentEmail], (err, results) => {
    if (err || results.length === 0) {
      return sendEncryptedError(res, now, 'User not found', 0);
    }

    const user = results[0];
    if (user.PASSWORD_ENCRYPT !== encryptedForComparison) {
      return sendEncryptedError(res, now, 'Password mismatch', 1);
    }

    const scoreQuery = `
      SELECT degree_DEGREE_NO, SCORE_PERCENT
      FROM carrerscores
      WHERE students_STUDENT_NO = ?
      ORDER BY degree_DEGREE_NO ASC
    `;
    db.query(scoreQuery, [user.STUDENT_NO], (err, scoreResults) => {
      if (err) {
        return sendEncryptedError(res, now, 'Failed to retrieve scores', 2);
      }

      const degreeScores = scoreResults.map(row => row.SCORE_PERCENT);

      const responsePayload = {
        status: 'success',
        studentId: user.STUDENT_NO,
        userName: user.STUDENT_USERNAME,
        personalityScores: [
          user.PERSONA_TEST_1,
          user.PERSONA_TEST_2,
          user.PERSONA_TEST_3,
          user.PERSONA_TEST_4
        ],
        selectedDegree: user.DEGREE_LINK_NO,
        degreeScores,
        timestamp: now
      };

      const encrypted = encryptData(JSON.stringify(responsePayload), secret);
      res.status(200).json({
        success: true,
        timestamp: now,
        iv: encrypted.iv,
        content: encrypted.content
      });
    });
  });
}

app.post('/login', loginNowNew);

app.listen(PORT, () => {
  console.log(`Login server running at http://localhost:${PORT}`);
});

module.exports = { loginNowNew };
