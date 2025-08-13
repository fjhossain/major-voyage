const crypto = require('crypto');
const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3308;

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
    2: 'decryption/encryption failure',
    3: 'failed to update student',
    4: 'failed to update scores'
  };
  const reasonStr = reasonMap[reasonCode] || 'unknown';

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
    content: encrypted.content,
    reason: reasonStr
  });
}

function updateNowNew(req, res) {
  const {
    studentEmail,
    encryptedField,
    studentName,
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

    const updateStudentQuery = `
      UPDATE students SET
        STUDENT_USERNAME = ?,
        PERSONA_TEST_1 = ?,
        PERSONA_TEST_2 = ?,
        PERSONA_TEST_3 = ?,
        PERSONA_TEST_4 = ?,
        DEGREE_LINK_NO = ?
      WHERE STUDENT_NO = ?
    `;
    const studentValues = [
      studentName,
      persona1,
      persona2,
      persona3,
      persona4,
      selectedDegreeNo,
      user.STUDENT_NO
    ];

    db.query(updateStudentQuery, studentValues, (err) => {
      if (err) {
        return sendEncryptedError(res, now, 'Failed to update student', 3);
      }

      const scoreQuery = `
        SELECT SCORE_SET_NO, degree_DEGREE_NO
        FROM carrerscores
        WHERE students_STUDENT_NO = ?
        ORDER BY degree_DEGREE_NO ASC
      `;
      db.query(scoreQuery, [user.STUDENT_NO], (err, scoreResults) => {
        if (err || scoreResults.length === 0) {
          return sendEncryptedError(res, now, 'Failed to retrieve scores', 4);
        }

        let updateCount = 0;
        scoreResults.forEach((scoreRow, index) => {
          const newScore = degreePercentSet[index];
          const updateScoreQuery = `
            UPDATE carrerscores SET SCORE_PERCENT = ?
            WHERE SCORE_SET_NO = ?
          `;
          db.query(updateScoreQuery, [newScore, scoreRow.SCORE_SET_NO], (err) => {
            if (err) {
              return sendEncryptedError(res, now, `Failed to update score ${index + 1}`, 4);
            }
            updateCount++;
            if (updateCount === scoreResults.length) {
              const response = {
                status: 'success',
                message: 'Student updated successfully',
                timestamp: now
              };
              const encrypted = encryptData(JSON.stringify(response), secret);
              res.status(200).json({
                success: true,
                timestamp: now,
                iv: encrypted.iv,
                content: encrypted.content
              });
            }
          });
        });
      });
    });
  });
}

app.post('/update', updateNowNew);

app.listen(PORT, () => {
  console.log(`Update server running at http://localhost:${PORT}`);
});

module.exports = { updateNowNew };
