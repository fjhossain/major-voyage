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
        case 3:
            reasonStr = 'Failed insertion into carrerscores on update';
            break;
        case 4:
            reasonStr = 'failed to insert a score to the table';
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
    return json ({
        success: false,
        timestamp,
        iv: encrypted.iv,
        content:encrypted.content,
        reason: reasonStr
    });
}
export function updateNow(email,
            encryptedField,
            studentName,
            persona1,
            persona2,
            persona3,
            persona4,
            selectedDegreeNo,
            degreePercentSet) {
    const now = Date.now();
   try {
        const decryptedPassword = encryptedField;
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
        const userNo = user.STUDENT_NO
        const query = 'UPDATE INTO students' +
            '(STUDENT_NO, STUDENT_EMAIL, STUDENT_USERNAME,  '+
            'PERSONA_TEST_1, PERSONA_TEST_2, PERSONA_TEST_3, PERSONA_TEST_4, DEGREE_LINK_NO) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
        const VALUES = [
            userNo,
            email,
            studentName,
            persona1,
            persona2,
            persona3,
            persona4,
            selectedDegreeNo,
        ];
        db.query(query, VALUES, result)
            if(err|| results.length === 0) {
                return sendEncryptedError(
                    res, input.studentEmail.toString + 
                    "INSERT INTO FABLE f", 
                    err.message,
                    2
                );
            }
        //SCORE_SET_NO, SCORE_PERCENT, degree_DEGREE_NO, students_STUDENT_NO
        query = 'SELECT * FROM carrerscores WHERE students_STUDENT_NO = ?;'
        db.query(query,userNo, result2s)
        if(err|| results.length === 0) {
                return sendEncryptedError(
                    res, input.studentEmail.toString + 
                    "INSERT INTO FABLE f", 
                    err.message,3
                );
            }
        result2s.forEach(item => {
            const query = 'UPDATE INTO carrerscores (SCORE_SET_NO, SCORE_PERCENT, degree_DEGREE_NO, students_STUDENT_NO) VALUES (?, ?, ?, ?);'
            const newSCORE_PERCENT = degreePercentSet[degree_DEGREE_NO - 1];
            const values = [
                item.SCORE_SET_NO,
                newSCORE_PERCENT,
                item.degree_DEGREE_NO,
                userNo
            ];
            db.query(query, values, (error, results, fields));
            if(err|| results.length === 0) {
                return sendEncryptedError(
                    res, input.studentEmail.toString + 
                    "INSERT INTO FABLE f", 
                    err.message,4
                );
            }
        });
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

            return json({
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
}
module.exports(updateNow);