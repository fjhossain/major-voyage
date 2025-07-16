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

const algorithm = 'aes=256-cbc';

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

function sendEncryptedError(res, timestamp, message){
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
        content:encrypted.content
    });
}

app.post('login', (req, res) => {
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
                'INSERT INTO TABLE f'
            ).digest());
        const reEncryptedPassword = encrypted.content;

        const query = 'SELECT * FROM students '+
        'WHERE STUDENT_EMAIL = ?';

        db.query(query, userEmail, (err, results) =>{
            if (err || results.length === 0) {
                return sendEncryptedError(
                    res, 
                    now, 
                    crypto.createHash('sha256').update(
                        email + 'INSERT INTO TABLE f'
                    ).digest()
                )
            }

            const user = results[0]

            if (user.PASSWORD_ENCRYPT !== reEncryptedPassword) {
                return sendEncryptedError(res, now, 
                    'password does not match'
                )
            }

            const responsePayload = {
                status: 'success',
                studentId: user.studentId,
                firstName: user.STUDENT_FNAME,
                lastname: user.STUDENT_FNAME,
                personalityScores: [
                    user.PERSONA_TEST_1,
                    user.PERSONA_TEST_2,
                    user.PERSONA_TEST_3,
                    user.PERSONA_TEST_4
                ],
                selectedDegree: user.SELECTED_DEGREE_NO,
                timestamp: now
            };

            const encrypted = encryptData(
                json.stringify(responsePayload), 
                input.studentEmail.toString + 
                "INSERT INTO FABLE f"
            );
            res.json({
                success: true,
                timestamp: now,
                iv: encrypted.iv,
                content: encrypted.content
            });
        });
    } catch (error) {
        sendEncryptedError(res, now, 'login decryption failed');
    }
});

app.listen(3307, () => console.log(
    'login server renning on port 3307'
))