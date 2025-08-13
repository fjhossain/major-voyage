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
        time: Date.now(),
        iv: encrypted.iv,
        content:encrypted.content
    });
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
/* 
input = 
    encryptedField:password,
    timekey,
    studentName,
    studendEmail:email,
    persona1,
    persona2,
    persona3,
    persona4,
    selectedDegreeNo,
    degreePercentSet
*/
export function registerNow(
    studendEmail, 
    studentName, 
    password, 
    persona1, 
    persona2, 
    persona3, 
    persona4, 
    selectedDegreeNo,
    degreePercentSet
) {

    const now = Date.now();

    try{
        const decryptedPassword = password;
        const encryptedForDB = encryptData(
            decryptedPassword, 
            studendEmail.toString + 
            "Insert into table f"
        );

        const query = 'INSERT INTO students' +
            '(STUDENT_NO, STUDENT_EMAIL, STUDENT_USERNAME, PASSWORD_ENCRYPT, PERSONA_TEST_1, PERSONA_TEST_2, ' +
            'PERSONA_TEST_3, PERSONA_TEST_4, STUDENT_CREATION_TIME, DEGREE_LINK_NO) ' +
            'VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
        const VALUES = [
            studendEmail,
            studentName,
            encryptedForDB.content.toString(),
            persona1,
            persona2,
            persona3,
            persona4,
            now,
            selectedDegreeNo
        ];
        
        const queryThree = 'SELECT STUDENT_NO FROM students WHERE STUDENT_EMAIL = ? '
        const valuesThree = studendEmail
        const queryTwo = 'INSERT INTO `csi_4999projectset`.`carrerscores` (`SCORE_SET_NO`, `SCORE_PERCENT`, `degree_DEGREE_NO`, `students_STUDENT_NO`) VALUES (NULL, ?, ?, ?);';
        try {
            db.query(query, VALUES, (err, result, queryReturnOne)) 
            if(err|| result.length ===0 ) {
                return sendEncryptedError(
                    res, studentEmail.toString + 
                    "INSERT INTO FABLE f", 
                    err.message
                );
            }
            db.query(queryThree, valuesThree, (err, result, queryReturnThree))
            varIncrenmentation = 1;
            const user = result[0] || queryReturnThree;
            degreePercentSet.forEach(lineItem => {
                const varsTwo = {
                    lineItem,
                    varIncrenmentation,
                    user
                }
                db.query(queryTwo, varsTwo, (err, result, queryReturnTwo))
                if(err|| result.length ===0 ) {
                    return sendEncryptedError(
                        res, studentEmail.toString + 
                        "INSERT INTO FABLE f", 
                        err.message
                    );
                }
                varIncrenmentation += 1;
            });
            const response = {
                status: 'success',
                message: 'student created successfully',
                content: 0,
                timestamp: studentEmail.toString + 
                "INSERT INTO FABLE f"
            };
            const encrypted = encryptData(
                JSON.stringify(
                    response
                ), 
                studentEmail.toString + 
                "INSERT INTO FABLE f"
            );
            
            console.log(JSON.stringify(response));
            let Result =json({
                success: true,
                timestamp: now,
                iv:encrypted.iv,
                content: encrypted.content
            });
            return Result;
    }catch (error) {
        return sendEncryptedError(
            res,
            now,
            errormessage || 'Encryption or valitdation error'
        );
    }
}catch (error) {
   log.error("error line 202:", error); 
}}

app.get('/users', (req,res)=> {
    db.query('SELECT * FROM users', (err, results) =>{
        if(err) return res.status(500).JSON({error:err.message});
    
        res.JSON(results);
    })
})

app.listen(PORT, () =>{
    console.log('server is live at http://localhost:${PORT}')
})
/*
const inputvariables = {
            studentId,
            firstName,
            lastName,
            STUDENT_EMAIL,
            password,
            persona1,
            persona2,
            persona3,
            persona4,
            dateCreated,
            selectedDegreeNo
        };
*/
/*
async function storeEncryptedNewUser(inputvariables, dbConfig) {
    try{    
        const {
            studentId,
            firstName,
            lastName,
            STUDENT_EMAIL,
            password,
            persona1,
            persona2,
            persona3,
            persona4,
            thistime,
            selectedDegreeNo
        } = inputvariables;
        //recieved user request, now acting on the user request first decrypt the pass
        const decryptedPassword = decryptdata(password, thistime);
        
        
        //generate timestamp for the db and response encryption
        const now = Date.now();

        //encrypt pass with this timedate
        const encryptForDB = encryptData(decryptedPassword, now);

        //store it in Mysql
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO `csi_4999projectset`.`students` (`STUDENT_NO`, `STUDENT_ID`, `STUDENT_FNAME`, `STUDENT_LNAME`, `STUDENT_EMAIL`, `PASSWORD_ENCRYPT`, `PERSONA_TEST_1`, `PERSONA_TEST_2`, `PERSONA_TEST_3`, `PERSONA_TEST_4`, `STUDENT_CREATION_TIME`, `SELECTED_DEGREE_NO`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', 
            [
                studentId,
                firstName,
                lastName,
                STUDENT_EMAIL,
                encryptForDB,
                persona1,
                persona2,
                persona3,
                persona4,
                now,
                selectedDegreeNo
            ]
        );
        await connection.end();

        //now to encrypt the response password with a new date!
        now = Date.now();
        const encryptForResponse = encryptData(decryptedPassword, now);

        //now to send response message
        const responseMessage = JSON.stringify({
            status: 'success',
            message: 'User account created successfully',
            timestamp: now,
            passwordEncrypt:encryptForResponse
        });
        const encryptedResponse = encryptData(responseMessage, now)
        return {
            success: true,
            timestamp: now,
            iv: encryptedResponse.iv,
            content:encryptedResponse.content
        };
    } catch (error) {
        const now = Date.now();
        const errorMessage = json.stringify({
            status: 'error',
            message: error.message || 'Something went wrong',
            timestamp: now
        });
        const encryptedResponseError = encryptData(errorMessage,now);
        return {
            status:'failure' ,
            timestamp: now,
            iv:encryptedResponseError,
            content: encryptedResponseError.content
        }
    }

} */
module.exports(registerNow)