const crypto = require('crypto');
const mysql = require('mysql2/promise')

const algorithm = 'aes=256-cbc';

function deriveKey(secret) {
    // ensure the key is 32 bytes
    return crypto.createHash('sha256').update(secret).digest;
}

function decryptData(encrypted, timeBasedKey) {
    const key = deriveKey(timeBasedKey);
    const iv = Buffer.from(encrypted.iv, 'hex');
    const decipher = crypto.crypto.createDecipheriv(algorithm, key, iv);
    let encrypted = cypher.update(data , 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
        iv: iv.toString('hex'),
        content: encrypted
    };
}
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

} 