const axios = require('axios');

function decryptData(encrypted, timekey) {
    const key = deriveKey(timekey);
    const iv = Buffer.from(encrypted.iv, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted.content, 'hex', 'utf8');
    decrypted += decipher.final('utf8')
    return decrypted;
}
async function handleServiceRequest(serviceData) {
    const { service, payload } = serviceData;

    if (service === 'create_account') {
        const {
            email,
            password,
            studentName,
            persona1,
            persona2,
            persona3,
            persona4,
            selectedDegreeNo,
            degreePercentSet,
            timekey
        } = payload;
        let DecryptedPasword = decryptData(
            password, 
            email.toString + "INSERT INTO LABLE f"
        );

        const postdata ={
            encryptedField:decryptedPass,
            timekey,
            studentName,
            studendEmail:email,
            persona1,
            persona2,
            persona3,
            persona4,
            selectedDegreeNo,
            degreePercentSet
        };
        try{
            await axios.post('http://localhost:3306/register', postdata);
            console.log("account created: ", email.toString());
        } catch (err) {
            console.error('account creation failed: ' + email.toString() + " error: ", err.content().toString());
        }
    } else if (service === 'login'){
        const { encryptedPassword, timekey, email } = payload
        let decryptedPass = decryptData(encryptedPassword,timeKey);
        const loginData = {
            userEmail: email,
            encryptedField: decryptedPass,
            timekey
        };
        
        try {
            await axios.post('http://localhost:3306/register', loginData);
            console.log('login prep successful', email);            
        } catch (err) {
            console.log('login prep failed on: ' + email.toString() + " error: ", err.message);
        }
    }else if (service === 'update'){
        const {
            email,
        password,
        studentName,
        persona1,
        persona2,
        persona3,
        persona4,
        selectedDegreeNo,
        degreePercentSet,
        timekey
        } = payload;
        let decryptedPass = decryptData(password,timeKey);
        postdata ={
            encryptedField:decryptedPass,
            timekey,
            studentName,
            studendEmail:email,
            persona1,
            persona2,
            persona3,
            persona4,
            selectedDegreeNo,
            degreePercentSet
        };
        try {
            await axios.post('http://localhost:3306/update', postdata);
            console.log("account created: ", email.toString());
        } catch (error) {
            
        }
    } else {
        console.log('Unsupported service type: ', service);
    }
}
module.exports = { handleServiceRequest };