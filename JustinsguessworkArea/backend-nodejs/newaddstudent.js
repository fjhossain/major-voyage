const crypto = require('crypto');
const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');

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
    console.error('DB connection failed:', err);
    return;
  }
  console.log('MySQL connected!');
});

const algorithm = 'aes-256-cbc';

function deriveKey(secret) {
  return crypto.createHash('sha256').update(secret).digest();
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

function decryptData(encrypted, keySource) {
  const key = deriveKey(keySource.toString());
  const iv = Buffer.from(encrypted.iv, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted.content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function sendEncryptedError(res, timestamp, message) {
  const response = {
    status: 'error',
    message,
    timestamp
  };
  const encrypted = encryptData(JSON.stringify(response), timestamp);
  res.status(500).json({
    success: false,
    timestamp,
    iv: encrypted.iv,
    content: encrypted.content
  });
}

function getDegreeIds(callback) {
  db.query('SELECT DEGREE_NO FROM degree ORDER BY DEGREE_NO ASC', (err, results) => {
    if (err || results.length === 0) return callback([]);
    const degreeIds = results.map(row => row.DEGREE_NO);
    callback(degreeIds);
  });
}

function registerNowNew(req, res) {
  const {
    studentEmail,
    studentName,
    encryptedField,
    timekey,
    persona1,
    persona2,
    persona3,
    persona4,
    selectedDegreeNo,
    degreePercentSet
  } = req.body;

  const now = Date.now();
  const secret = studentEmail + 'Insert into table f';

  let decryptedPassword;
  try {
    decryptedPassword = decryptData(encryptedField, secret);
  } catch (err) {
    return sendEncryptedError(res, now, 'Password decryption failed');
  }

  const encryptedForDB = encryptData(decryptedPassword, secret);

  const insertStudentQuery = `
    INSERT INTO students (
      STUDENT_EMAIL, STUDENT_USERNAME, PASSWORD_ENCRYPT,
      PERSONA_TEST_1, PERSONA_TEST_2, PERSONA_TEST_3, PERSONA_TEST_4,
      STUDENT_CREATION_TIME, DEGREE_LINK_NO
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const studentValues = [
    studentEmail,
    studentName,
    encryptedForDB.content,
    persona1,
    persona2,
    persona3,
    persona4,
    now,
    selectedDegreeNo
  ];

  db.query(insertStudentQuery, studentValues, (err) => {
    if (err) {
      return sendEncryptedError(res, now, 'Failed to insert student: ' + err.message);
    }

    db.query('SELECT STUDENT_NO FROM students WHERE STUDENT_EMAIL = ?', [studentEmail], (err, results) => {
      if (err || results.length === 0) {
        return sendEncryptedError(res, now, 'Failed to retrieve student ID');
      }

      const studentId = results[0].STUDENT_NO;

      getDegreeIds((degreeIds) => {
        if (degreeIds.length !== degreePercentSet.length) {
          return sendEncryptedError(res, now, 'Mismatch between degree count and score set');
        }

        const scoreValues = degreeIds.map((degreeId, index) => [
          degreePercentSet[index],
          degreeId,
          studentId
        ]);

        const insertScoresQuery = `
          INSERT INTO carrerscores (SCORE_PERCENT, degree_DEGREE_NO, students_STUDENT_NO)
          VALUES ?
        `;
        db.query(insertScoresQuery, [scoreValues], (err) => {
          if (err) {
            return sendEncryptedError(res, now, 'Failed to insert career scores');
          }

          const response = {
            status: 'success',
            message: 'Student registered successfully',
            timestamp: now,
            content: 0
          };
          const encrypted = encryptData(JSON.stringify(response), secret);
          res.status(200).json({
            success: true,
            timestamp: now,
            iv: encrypted.iv,
            content: encrypted.content
          });
        });
      });
    });
  });
}

app.post('/register', registerNowNew);

app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});

module.exports = { registerNowNew };
