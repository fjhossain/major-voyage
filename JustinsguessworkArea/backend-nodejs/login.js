const express = require('express');
const mysql = require('mysql2');
const crypto = require('crypto');
const app = express();

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'CSI4999App',
    password: 'thiscsi4999(r@p',
    database: 'csi_4999projectset'
});

const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
function deriveKey(secret) {
    // ensure the key is 32 bytes
    return crypto.createHash('sha256').update(secret).digest();
}

function decryptData(encrypted, timekey) {
    const key = deriveKey(timekey);
    const iv = Buffer.from(encrypted.iv, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted.content, 'hex', 'utf8');
    decrypted += decipher.final('utf8')
    return decrypted;
}

function encryptData(data, timestamp) {
    const key = deriveKey(timestamp.toString());
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm,key,iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        iv:iv.toString('hex'),
        content: encrypted
    };
}

function sendEncryptedError(res, timestamp, message, reason){
    reasonStr = "";
    switch (reason) {
        case 0:
            reasonStr = "no user";
            break;
        case 1:
            reasonStr = "wrong pass";
            break;
        case 2:
            reasonStr = "decryption/encryption failure";
            break;  
        default:
            reasonStr = "no";
            break;
    }
    const response = {
        status: 'error',
        message,
        timestamp,
    };
    const encrypted = encryptData(
        JSON.stringify(response), 
        timestamp
    );
    res.status(500).json ({
        success: false,
        timestamp,
        iv: encrypted.iv,
        content:encrypted.content,
        reason: reasonStr
    });
}
function getScoresBasedOnStudentNo(studentID){
          const scoreQuery = `
        SELECT *
        FROM student_degree_scores
        WHERE students_STUDENT_NO = ?
      `;
        var scoreResults
        db.query(scoreQuery, [studentID],  scoreResults) 
        if (scoreResults.length() >= 1) {
                log.error('failed to retrieve scores');
                scoreResults = getScoresBasedOnStudentNo(studentID);
                return scoreResults
        }
        
        return scoreResults;

}
/*
table 'students':
STUDENT_NO, 
STUDENT_EMAIL, 
STUDENT_USERNAME, 
PASSWORD_ENCRYPT, 
PERSONA_TEST_1, 
PERSONA_TEST_2, 
PERSONA_TEST_3, 
PERSONA_TEST_4, 
STUDENT_CREATION_TIME, 
DEGREE_LINK_NO
table 'degree':
DEGREE_NO, 
PERSONA_1_PREF, 
PERSONA_2_PREF, 
PERSONA_3_PREF, 
PERSONA_4_PREF, 
DEGREE_NAME, 
degree_DEGREE_NO
table 'carrerscores':
SCORE_SET_NO, 
SCORE_PERCENT, 
degree_DEGREE_NO, 
students_STUDENT_NO
*/

app.post('/login', (req, res) => {
    const{userEmail, encryptedField, timekey} = req.body;
    const now = Date.now();
    
    try {
        const decryptedPassword = decryptData(encryptedField,timeKey);
        const encrypted = encryptData(
            decryptedPassword, 
            crypto.createHash(
                'sha256'
            ).update(
                email + 
                'Insert into table f'
            ).digest());
        const reEncryptedPassword = encrypted.content;

        const query = 'SELECT * FROM students '+
        'WHERE STUDENT_EMAIL = ?';

        db.query(query, userEmail,  (err, result, queryReturn))
        if (err || results.length === 0) {
            return sendEncryptedError(
                res, 
                now, 
                crypto.createHash('sha256').update(
                    email + 'INSERT INTO TABLE f'
                ).digest(),
                0
            )
        }

        const user = results[0]

        if (user.PASSWORD_ENCRYPT !== reEncryptedPassword) {
            return sendEncryptedError(res, now, 
                'password does not match',1
            )
        }
        results = getScoresBasedOnStudentNo()
        const responsePayload = {
            status: 'success',
            studentId: user.studentId,
            userName: user.STUDENT_USERNAME,
            personalityScores: [
                user.PERSONA_TEST_1,
                user.PERSONA_TEST_2,
                user.PERSONA_TEST_3,
                user.PERSONA_TEST_4
            ],
            selectedDegree: user.SELECTED_DEGREE_NO,
            degreeScores: results,
            timestamp: now
        };
        const reencrypted = encryptData(
            json.stringify(responsePayload), 
            now
        );
        res.json({
            success: true,
            timestamp: now,
            iv: reencrypted.iv,
            content: reencrypted.content
        });
        
    } catch (error) {
        sendEncryptedError(
            res, 
            now, 
            'login decryption failed', 
            2
        );
    }
});


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

function decryptData(encrypted, keySource, ivHex) {
    const key = deriveKey(keySource.toString());
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted.content, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function encryptPass(password, email) {
    return encryptData(password, email + "INSERT INTO TABLE f");
}

module.exports = { encryptPass, decryptData };

app.listen(3307, () => console.log(
    'login server renning on port 3307'
))