const axios = require('axios');

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
            selectedDegreeNo,
            degreeSetString,
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
            selectedDegreeNo,
            degreeSetString
        };
        try{
            await axios.post('http://localhost:3306/register', postdata);
            console.log("account created: ", email.toString());
        } catch (err) {
            console.error('account creation failed: ' + email.toString() + " error: ", err.content().toString());
        }
    } else if (service === 'login'){
        const { encryptedPassword, timekey, email } = payload

        const loginData = {
            userEmail: email,
            encryptedField: encryptedPassword,
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
            studentId,
            firstName,
            lastName,
            email,
            password,
            persona1,
            persona2,
            persona3,
            persona4,
            selectedDegreeNo,
            degreeSetString,
            timekey
        } = payload;
        postdata ={
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
            selectedDegreeNo,
            degreeSetString
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