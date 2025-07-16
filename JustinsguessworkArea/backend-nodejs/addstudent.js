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

app.post('/register', async (req, res) => {
    const input = req.body;
    const now = Date.now();

    try{
        const decryptedPassword = decryptData(
            input.encryptedField, 
            input.studentEmail.toString + "INSERT INTO LABLE f"
        );

        const encryptedForDB = encryptData(
            decryptedPassword, 
            input.studentEmail.toString + 
            "Insert into table f"
        );

        const query = 'INSERT INTO students' +
            '(STUDENT_ID, STUDENT_FNAME, STUDENT_LNAME,  ' +
            'STUDENT_EMAIL, PASSWORD_ENCRYPT, PERSONA_TEST_1, ' +
            'PERSONA_TEST_2, PERSONA_TEST_3, PERSONA_TEST_4, ' + 
            ' STUDENT_CREATION_TIME, SELECTED_DEGREE_NO,' +
            'DegreeSetString) ' +
            'VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ' +
            '?, ?, ?, ?, ?);';
        const VALUES = [
            input.studentID,
            input.firstname,
            input.lastname,
            input.studentEmail,
            encryptedForDB.content.toString(),
            input.persona1,
            input.persona2,
            input.persona3,
            input.persona4,
            now,
            input.selectedDegreeNo,
            degreeSetString
        ];
        db.query(query, VALUES, (err,result)=> {
            if(err) {
                return sendEncryptedError(
                    res, input.studentEmail.toString + 
                    "INSERT INTO FABLE f", 
                    err.message
                );
            }
            
            const response = {
                status: 'success',
                message: 'student created successfully',
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
        });
    }catch (error) {
        return sendEncryptedError(
            res,
            now,
            errormessage || 'Encryption or valitdation error'
        );
    }
});

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