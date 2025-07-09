const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');

const algorithm = 'aes-256-cbc';

function deriveKey(secret) {
    return crypto.createHash('sha256').update(secret).digest();
}

function decryptResponse(response, key) {
    const newKey = deriveKey(key.toString());
    const iv = Buffer.from(response.iv, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, newKey, iv);
    let decrypted = decipher.update(response.content, 'hex', utf8);
    decrypted += decipher.final('utf8')
    return json.parse(decrypted);
}

async function handleServiceRequest(serviceData) {
    const { service, payload } = serviceData;

    if (service === 'create_account') {
        const {
            studentId,
            firstName,
            lastName,
            email,
            password,
            persona1,
            persona2,
            persona3,
            persona4,
            dateCreated,
            selectedDegreeNo,
            timekey
        } = payload;
        const postdata ={
            encryptedField:password,
            timekey,
            studentId,
            firstName,
            lastName,
            studendEmail:email,
            persona1,
            persona2,
            persona3,
            persona4,
            selectedDegreeNo
        };
        try{
            const res = await axios.post(
                'http://localhost:3306/register', 
                postdata
            );
            const decrypted = decryptResponse(
                res.data,
                res.data.timestamp
            );
            console.log("account created: ", email.toString());
        } catch (err) {
            console.error(
                'account creation failed: ' + 
                email.toString() + 
                " error: ", 
                err.content().toString()
            );
        }
    } else if (service === 'login'){
        const { encryptedPassword, timekey, email } = payload

        const loginData = {
            userEmail: email,
            encryptedField: encryptedPassword,
            timekey
        };

        try {
            const res = await axios.post(
                'http://localhost:3306/register', 
                logindata
            );
            const decrypted = decryptResponse(
                res.data, 
                res.data.timestamp
            );
            console.log('login prep successful', email);            
        } catch (err) {
            console.log(
                'login prep failed on: ' + 
                email.toString() +
                " error: ", 
                error.message
            );
        }
    }else {
        console.log(
            'Unsupported service type: ', 
            service
        );
    }
}
module.exports = { handleServiceRequest };