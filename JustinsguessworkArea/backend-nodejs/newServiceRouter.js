import { decryptData, encryptPass } from './encryption'; // assumes modular encryption helpers
var { loginAskNew } = require('./newLogin');
var { registerNowNew } = require('./newaddstudent');
var { updateNowNew } = require('./newUpdateStudent')
const SERVER_URL = 'http://localhost:3000/submit';

export async function handleServiceRequest(serviceData) {
  const { service, payload } = serviceData;
  const { email, password, timekey = Date.now(), ...rest } = payload;

  const encryptedPass = await encryptPass(password, email);

  const requestPayload = {
    service,
    studentEmail: email,
    encryptedField: encryptedPass,
    timekey,
    ...rest
  };

  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestPayload)
    });

    const result = await response.json();

    if (!result.success) {
      console.error('Server error:', result.reason || result.message);
      return result;
    }

    const decrypted = await decryptData(result, email + 'Insert into table f');
    const parsed = JSON.parse(decrypted);
    return parsed;
  } catch (err) {
    console.error('Request failed:', err.message);
    return { error: 'Network or decryption error' };
  }
}

