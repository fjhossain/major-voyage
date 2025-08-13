const axios = require('axios');
var { loginAsk } = require('./login');
var { registerNow } = require('./addstudent');
var { updateNow } = require('./updatestudent')
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

function deriveKey(secret) {
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
async function handleServiceRequest(serviceData) {
  const { service, payload } = serviceData;
  let email, password, studentName, persona1, persona2, persona3, persona4, selectedDegreeNo, degreePercentSet, timekey;

  if (service === 'login') {
    ({ email, password, timekey } = payload);
  } else {
    ({ email, password, studentName, persona1, persona2, persona3, persona4, selectedDegreeNo, degreePercentSet, timekey } = payload);
  }

  const secret = email + "INSERT INTO TABLE f";
  let decryptedPass;

  try {
    decryptedPass = decryptData(password, secret);
  } catch (err) {
    console.error(`Decryption failed for ${email}:`, err.message);
    return;
  }
  if (service === 'register') {
    return registerNow(
      email, 
      studentName, 
      password, 
      persona1, 
      persona2, 
      persona3, 
      persona4, 
      selectedDegreeNo, 
      degreePercentSet
    )
  } else if (service === 'update') {
    return updateNow(
      email, 
      password, 
      studentName, 
      persona1, 
      persona2, 
      persona3, 
      persona4, 
      selectedDegreeNo, 
      degreePercentSet
    )
  } else if (service === 'login') {
    return loginAsk(
      email, 
      password
    )
  } else {
    console.log('Unsupported service type:', service);
    return;
  }

}

module.exports = { handleServiceRequest };