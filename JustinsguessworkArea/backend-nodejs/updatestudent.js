const crypto = require('crypto');                   
const mysql = require('mysql2');
const cors = require('cors');
const express = require('express');

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

db.connect(err=> {
    if (err) {
        console.error('DB connection failed', err)
        return;
    }
    console.log('MySQL connected!');
})

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
app.post('/update', async (req, res) => {
    const input = req.body;
    const now = Date.now();
    const {
            password,
            timekey,
            studentId,
            firstName,
            lastName,
            email,
            persona1,
            persona2,
            persona3,
            persona4,
            selectedDegreeNo,
            degreeSetString
        }= input
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
   
        db.query(query, userEmail, results)
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
    
    } catch (error) {
        sendEncryptedError(
            res, 
            now, 
            'login confirmation decryption failed', 
            2
        );
    }

    try{

        const query = 'UPDATE INTO students' +
            '(STUDENT_ID, STUDENT_FNAME, STUDENT_LNAME,  ' +
            'STUDENT_EMAIL, PASSWORD_ENCRYPT, PERSONA_TEST_1, ' +
            'PERSONA_TEST_2, PERSONA_TEST_3, PERSONA_TEST_4, ' + 
            ' STUDENT_CREATION_TIME, SELECTED_DEGREE_NO,' +
            'DEGREE_LINK_NO) ' +
            'VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ' +
            '?, ?, ?, ?, ?);';
        const VALUES = [
            input.studentID,
            input.firstname,
            input.lastname,
            input.studentEmail,
            encrypted.content.toString(),
            input.persona1,
            input.persona2,
            input.persona3,
            input.persona4,
            now,
            input.selectedDegreeNo,
            degreeSetString
        ];
        db.query(query, VALUES, result)
            if(err|| results.length === 0) {
                return sendEncryptedError(
                    res, input.studentEmail.toString + 
                    "INSERT INTO FABLE f", 
                    err.message
                );
            }
            
            const response = {
                status: 'success',
                message: 'student updated successfully',
                timestamp: input.studentEmail.toString + 
                "INSERT INTO FABLE f"
            };
            const encrypted = encryptData(
                JSON.stringify(
                    response
                ), 
                input.studentEmail.toString + 
                "INSERT INTO FABLE f"
            );

            res.json({
                success: true,
                timestamp: now,
                iv:encrypted.iv,
                content: encrypted.content
            });
    }catch (error) {
        return sendEncryptedError(
            res,
            now,
            errormessage || 'Encryption or valitdation error'
        );
    }
});
