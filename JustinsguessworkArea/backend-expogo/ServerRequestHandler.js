const crypto = require('crypto');

const algorithm = 'aes=256-cbc';

function deriveKey(secret) {
    // ensure the key is 32 bytes
    return crypto.createHash('sha256').update(secret).digest();
}

function decryptData(encrypted, timekey, iv) {
    const key = deriveKey(timekey);
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
setOfData contains(in this order){
    STUDENT_EMAIL, 
    STUDENT_USERNAME, 
    PASSWORD_ENCRYPT, 
    persona1,
    persona2,
    persona3,
    persona4,
    selectedDegreeNo, this can be set as a null variable, will handle as 0 which is the undecided var
    numbers related to degree percents(starting at 0 ending in the last degree)
}
*/
async function registerRequest(setOfData){
    var iteration = 0;
    const {
        email,
        password,
        studentName,
        persona1,
        persona2,
        persona3,
        persona4,
        selectedDegreeNo,
    } = null;
    const degreePercentSet = []
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
                studentName = dataItem;
                break;
            case 3:
                persona1 = dataItem;
                break;
            case 4:
                persona2 = dataItem;
                break;
            case 5:
                persona3 = dataItem;
                break;
            case 6:
                persona4 = dataItem;
                break;
            case 7:
                selectedDegreeNo = dataItem;
                break;
            default:
                degreePercentSet.push(dataItem);
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
        email,
        password,
        studentName,
        persona1,
        persona2,
        persona3,
        persona4,
        selectedDegreeNo,
        degreePercentSet,
        Date.now()        
    );

}

async function loginrequest(email, password) {
    const timeKey = Date.now().toString();
    const encryptedPassword = await encryptPass(password, timeKey);

    const payload = {
        service: 'login',
        userEmail: email,
        encryptedField: encryptedPassword,
        iv:encryptedPassword.iv,
        timeKey
    };

    try {
        const sending = await fetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'applictation/json'},
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.error) {
            console.error("Login Failed: ", result.error);
        } else {
            const decryptData = await decryptData(encryptd, encryptData.content, encryptData.iv);
            if(encryptData.status === false) {
                const reasonStr = encryptData.reason;
                if (reasonStr ==="no user") {
                    return('Regsiter');
                } else if (reasonStr === "wrong pass") {
                    return('wrongPass');
                } else if (reasonStr === "decryption/encryption failure") {
                    return('resend')
                } else {
                    console.error('1=== weird logic error at login.js packet recieved: ', encryptData.content)
                    console.error('1=== unencrypted: ', decryptData);
                    console.error('1=== sent packet: ', payload.content);
                    console.error('');

                    return('resend');
                }
            } else { 
                //everything is working, now to change the input into what is expected inputs login
                /*const responsePayload = {
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
                degreeScores: user.DEGREE_LINK_NO,
                timestamp: now
            };*/
            /*
            studentId,
            firstName,
            lastName,
            persona1,
            persona2,
            persona3,
            persona4,
            selectedDegreeNo,
            degreePercentString*/
            }
            const new_studentId = decryptData.content.studentId;
            const new_firstName = decryptData.content.firstName;
            const new_lastName = decryptData.content.lastname;
            const new_persona1 = decryptData.content.personalityScores[0];
            const new_persona2 = decryptData.content.personalityScores[0];
            const new_persona3 = decryptData.content.personalityScores[0];
            const new_persona4 = decryptData.content.personalityScores[0];
            const new_selectedDegreeNo = decryptData.content.selectedDegree;
            const new_degreePercentString = decryptData.content.degreeScores;
            
            return {
                studentId:new_studentId,
                firstName:new_firstName,
                lastName:new_lastName,
                persona1:new_persona1,
                persona2:new_persona2,
                persona3:new_persona3,
                persona4:new_persona4,
                selectedDegreeNo:new_selectedDegreeNo,
                degreePercentString:new_degreePercentString
            };
        }
    } catch (error) {
        console.error("error detected in ServerRequestHandler.js", error);
    }
} 
async function update(setOfData) {
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
        'Update', 
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