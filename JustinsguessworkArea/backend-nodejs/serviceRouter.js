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

  let {
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

  const secret = email + "INSERT INTO TABLE f";
  let decryptedPass;

  try {
    decryptedPass = decryptData(password, secret);
  } catch (err) {
    console.error(`Decryption failed for ${email}:`, err.message);
    return;
  }

  let postdata = {
    encryptedField: decryptedPass,
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

  let endpoint;
  if (service === 'create_account') {
    endpoint = 'http://localhost:3000/register';
  } else if (service === 'update') {
    endpoint = 'http://localhost:3000/update';
  } else if (service === 'login') {
    endpoint = 'http://localhost:3000/login';
  } else {
    console.log('Unsupported service type:', service);
    return;
  }

  try {
    await axios.post(endpoint, postdata);
    console.log(`${service} successful for:`, email);
  } catch (err) {
    console.error(`${service} failed for ${email}:`, err.message);
  }
}

module.exports = { handleServiceRequest };