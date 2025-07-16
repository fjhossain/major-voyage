const crypto = require('crypto');

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

function encryptPass(password, email) {
    return encryptData(password, email.toString() + "INSERT INTO TABLE f");
}
/*
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
   } else if (service === 'login'){
        const { encryptedPassword, timekey, email } = payload

        const loginData = {
            userEmail: email,
            encryptedField: encryptedPassword,
            timekey
        };
*/
async function sendPacket(serviceToRequest, data) {
    const payload = {
        serviceToRequest, 
        data
    };
    try {
        //this is where we put where we are hosting it
        const response = await fetch(
            "nodeserverhere", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
        });

        const result = await response.JSON();
        console.log('Server Response:', result);
    } catch(error) {
        console.error('failed to send data ', error);
    }
}
/*setOfData contains(in this order){
    emailofstudent,
    password,
    studentId,
    firstName,
    lastName,
    persona1,
    persona2,
    persona3,
    persona4,
    selectedDegreeNo, this can be set as a null variable, will handle as 0 which is the undecided var
    numbers related to degree percents(can be up to 3 degrees for )
}
*/
async function registerRequest(setOfData){
    var iteration = 0;
    const {
        email,
        password,
        studentId,
        firstName,
        lastName,
        persona1,
        persona2,
        persona3,
        persona4,
        selectedDegreeNo,
        degreePercentString
    } = null;
    selectedDegreeNo = 0;
    firstname = 'John';
    lastName = 'Doe';
    setOfData.forEach(dataItem => {
        switch (iteration) {
            case 0:
                email = dataItem;
                break;
            case 1:
                password = dataItem;
                break;
            case 2:
                studentId = dataItem;
                break;
            case 3:
                firstName = dataItem;
                break;
            case 4:
                lastName = dataItem;
                break;
            case 5:
                persona1 = dataItem;
                break;
            case 6:
                persona2 = dataItem;
                break;
            case 7:
                persona3 = dataItem;
                break;
            case 8:
                persona4 = dataItem;
                break;
            case 9:
                selectedDegreeNo = dataItem;
                break;
            case 10:
                degreePercentString += (dataItem.toString + " ");
                break;
            default:
                break;
            
        }
    });
    const encryptedPass = encryptPass(
        password, 
        input.studentEmail.toString + 
        "INSERT INTO LABLE f"
    );
    sendPacket(
        'create_account', 
        studentId,
        firstName,
        lastName,
        email,
        encryptedPass,
        persona1,
        persona2,
        persona3,
        persona4,
        selectedDegreeNo,
        degreeSetString,
        Date.now()        
    );
}
