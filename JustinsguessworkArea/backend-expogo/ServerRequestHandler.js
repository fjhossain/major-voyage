
import * as Crypto from 'expo-crypto';
import AES from 'react-native-aes-crypto';
import 'react-native-get-random-values';

export async function deriveKey(secret) {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    secret
  );
  return hash; // already hex string
}

export async function encryptData(data, secret) {
  const key = await deriveKey(secret);
  const iv = Crypto.getRandomBytes(16); // returns Uint8Array
  const ivHex = Buffer.from(iv).toString('hex');

  const encrypted = await AES.encrypt(data, key, ivHex);
  return {
    iv: ivHex,
    content: encrypted
  };
}

export async function decryptData(encrypted, secret, ivHex) {
  const key = await deriveKey(secret);
  const decrypted = await AES.decrypt(encrypted.content, key, ivHex);
  return decrypted;
}
const algorithm = 'aes=256-cbc';


export async function encryptPass(password, email) {
  const secret = email + "INSERT INTO TABLE f";
  return await encryptData(password, secret);
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
async function sendPacket(service, email, encryptedPass, studentName, persona1, persona2, persona3, persona4, selectedDegreeNo, degreePercentSet, timekey) {
  const payload = {service,
  encryptedField: encryptedPass,
  timekey,
  studentName,
  studentEmail: email,
  persona1,
  persona2,
  persona3,
  persona4,
  selectedDegreeNo,
  degreePercentSet
};

fetch('http://localhost:3000/register', {
  method: 'POST',
  headers: {'Content-Type': 'applictation/json'},
  body: JSON.stringify(payload)
})
.then(res => res.text())
.then(data => console.log('Server response:', data))
.catch(err => console.error('Request failed:', err));


  try {
   const response = await fetch("http://localhost:3000", {
      method: 'POST',
      headers: {'Content-Type': 'applictation/json'},
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    const decrypted = await decryptData(result, password, result.iv);
    const parsed = JSON.parse(decrypted);
    return parsed.content === 0;
  } catch (error) {
    console.error('Failed to send data:', error);
    return false;
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
export async function registerRequest(setOfData){
    console.log(setOfData.toString());
    console.log('125');
    
    
    var email = setOfData[0]
    var password = setOfData[1]
    var    studentName = setOfData[2]
    var   persona1 = setOfData[3]
    var    persona2 = setOfData[4]
    var    persona3 = setOfData[5]
    var persona4 = setOfData[6]
    var selectedDegreeNo = setOfData[7]
    var degreePercentSet =setOfData[8]
    console.log(email);
    console.log('138');
    if (selectedDegreeNo=== null){selectedDegreeNo = 0;}
    console.log('140');
    if(studentName===null){studentName='johndoe'}
    console.log('142');
    if(email===null){email='johndoe'}
    studentName = 'John Doe';
    console.log('145');

    const encryptedPass = await encryptPass(
        password, 
        studentEmail + "INSERT INTO TABLE f"
    );
    console.log('152');
    return sendPacket(
        'create_account', 
        email,
        encryptedPass,
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

export async function loginrequest(email, password) {
    const timeKey = Date.now().toString();
    const encryptedPassword = await encryptPass(password, timeKey);
    console.log(184);
    
    const payload = {
        service: 'login',
        userEmail: email,
        encryptedField: encryptedPassword,
        iv:encryptedPassword.iv,
        timeKey
    };
    console.log(193);
    try {
        console.log(195);
        const sending = await fetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'applictation/json'},
            body: JSON.stringify(payload)
        });
        console.log(201);
        console.log(sending.status);
        console.log(await sending.text());
        console.log(await sending.blob());
        console.log(sending.blob)
        console.log(206);
        const result = await response.json();
        if (result.error) {
            console.error("Login Failed: ", result.error);
        } else {
            const decrypted = await decryptData(result, password, result.iv);
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
            status: 'success',
            studentId: user.studentId,
            userName: user.STUDENT_USERNAME,
            personalityScores: [
                user.PERSONA_TEST_1,
                user.PERSONA_TEST_2,
                user.PERSONA_TEST_3,
                user.PERSONA_TEST_4
            ],
            selectedDegree: user.SELECTED_DEGREE_NO,
            degreeScores: results,
            timestamp: now */
            }
            const new_studentId = decryptData.content.studentId;
            const new_userName = decryptData.content.userName;
            const new_persona1 = decryptData.content.personalityScores[0];
            const new_persona2 = decryptData.content.personalityScores[1];
            const new_persona3 = decryptData.content.personalityScores[2];
            const new_persona4 = decryptData.content.personalityScores[3];
            const new_selectedDegreeNo = decryptData.content.selectedDegree;
            const new_degreePercentString = decryptData.content.degreeScores;
            
            return {
                studentId:new_studentId,
                email:email,
                password:password,
                username:new_userName,
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
/* 
the set of degrees currently is:
1: arts
2: business
3: Management
4: hospitiality
5: undecided
6: informantion tech
*/
export async function update(setOfData) {
    var iteration = 0;
    let email, password, studentName, persona1, persona2, persona3, persona4, selectedDegreeNo = null
    var degreePercentSet = []
    selectedDegreeNo = 0;
    firstname = 'John';
    lastName = 'Doe';
    degreePercentSet = [];
    setOfData.forEach(dataItem => {
        switch (iteration) {
            case 0:
                email = dataItem;
                break;
            case 1:
                studentName = dataItem;
                break;
            case 2:
                password = dataItem;
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
    const encryptedPass = await encryptPass(
        password, 
        studentEmail + "INSERT INTO TABLE f"
    );
    return sendPacket(
        'Update', 
        email,
        encryptedPass,
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

