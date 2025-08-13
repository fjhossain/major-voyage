import * as Crypto from 'expo-crypto';
import AES from 'react-native-aes-crypto';

export async function deriveKey(secret) {
  console.log('7');
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    secret
  ); // returns hex string
}
console.log('AES module:', AES);

function hexArrayToDecimal(arr) {
  const hexString = arr
    .map(n => n.toString(16).padStart(2, '0')) // convert to 2-digit hex
    .join(''); // concatenate

  return BigInt('0x' + hexString); // convert to decimal using BigInt
}
//  Encryption
export async function encryptData(data, secret) {
  const key = await deriveKey(secret);
  const iv = Crypto.getRandomBytes(16); // 16 bytes for AES-256-CBC

  const ivHex = Array.from(iv)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const encrypted = await AES.encrypt(data, key, ivHex);
  return { iv: ivHex, content: encrypted };
}

//  Decryption
export async function decryptData(encryptedField, secret) {
  console.log('30');
  const key = await deriveKey(secret);
  console.log('32');
  return await AES.decrypt(encryptedField.content, key, encryptedField.iv);
}

//  Password Encryption Wrapper
export async function encryptPass(password, email) {
  console.log('38');
  const secret = email + 'INSERT INTO TABLE f';
  console.log('40');
  return await encryptData(password, secret);
}
// Timeout helper
function timeoutPromise(ms) {
  console.log('45');
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), ms)
  );
}

async function sendPacketWithRetry(service, payload, maxAttempts = 3) {
  console.log('52');
  const TIMEOUT_MS = 7000;
  console.log('54');
  function timeoutPromise(ms) {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), ms)
    );
  }
  console.log('60');
  var times = 0
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log('63:' + times.toString());
    try {
      const response = await Promise.race([
        fetch('http://192.168.1.12:3000/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ service, ...payload })
        }),
        timeoutPromise(TIMEOUT_MS)
      ]);
      console.log('73:' + times);
      const result = await response.json();
      console.log('75:' + times);
      return result;
    } catch (error) {
      console.log('78:' + times);
      const isTimeout = error.message.includes('timed out');
      console.log('80:' + times);
      const isNetwork = error.message.includes('Network');
      console.log('82:' + times);
      const shouldRetry = isTimeout || isNetwork;
      console.log('84:' + times);
      console.warn(` Attempt ${attempt} failed: ${error.message}`);
      console.log('86:' + times);
      if (!shouldRetry || attempt === maxAttempts) {
        console.log('88:' + times);
        return { error: isTimeout ? 'timeout' : 'network error' };
      }
      console.log('91:' + times);
      //  Exponential backoff
      const backoff = 500 * Math.pow(2, attempt - 1);
      console.log('94:' + times);
      await new Promise(res => setTimeout(res, backoff));
    }
    console.log('97:' + times);
    times += 1;
  }
}


//  Registration
export async function registerRequest(setOfData) {
  console.log('105');
  const [
    email,
    password,
    studentName = 'John Doe',
    persona1,
    persona2,
    persona3,
    persona4,
    selectedDegreeNo = 0,
    degreePercentSet
  ] = setOfData;
  console.log('117');
  const encryptedPass = await encryptPass(password, email);
  console.log('119');
  const payload = {
    encryptedField: encryptedPass,
    timekey: Date.now(),
    studentName,
    studentEmail: email,
    persona1,
    persona2,
    persona3,
    persona4,
    selectedDegreeNo,
    degreePercentSet
  };
  console.log('132');
  return await sendPacket('create_account', payload);
}

//  Login
export async function loginRequest(email, password) {
  const secret = email + 'INSERT INTO TABLE f';
  const encryptedPass = await encryptPass(password, email);

  const payload = {
    encryptedField: encryptedPass,
    timekey: Date.now(),
    studentEmail: email
  };

  const result = await sendPacket('login', payload);

  if (result.error) {
    console.error('Login failed:', result.error);
    return 'resend';
  }

  try {
    const decrypted = await decryptData(result, secret);
    const parsed = JSON.parse(decrypted);

    if (!parsed.status) {
      console.warn('Login status false:', parsed.reason);
      return parsed.reason || 'resend';
    }

    return {
      studentId: parsed.studentId,
      email,
      password,
      username: parsed.userName,
      persona1: parsed.personalityScores[0],
      persona2: parsed.personalityScores[1],
      persona3: parsed.personalityScores[2],
      persona4: parsed.personalityScores[3],
      selectedDegreeNo: parsed.selectedDegree,
      degreePercentString: parsed.degreeScores
    };
  } catch (err) {
    console.error(' Decryption failed:', err.message);
    return 'resend';
  }
}
