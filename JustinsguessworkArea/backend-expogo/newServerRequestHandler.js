import * as Crypto from 'expo-crypto';
import AES from 'react-native-aes-crypto';
import 'react-native-get-random-values';

//  Key Derivation
export async function deriveKey(secret) {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    secret
  ); // returns hex string
}

//  Encryption
export async function encryptData(data, secret) {
  const key = await deriveKey(secret);
  const iv = Crypto.getRandomBytes(16); // Uint8Array
  const ivHex = Buffer.from(iv).toString('hex');
  const encrypted = await AES.encrypt(data, key, ivHex);

  return { iv: ivHex, content: encrypted };
}

//  Decryption
export async function decryptData(encryptedField, secret) {
  const key = await deriveKey(secret);
  return await AES.decrypt(encryptedField.content, key, encryptedField.iv);
}

//  Password Encryption Wrapper
export async function encryptPass(password, email) {
  const secret = email + 'INSERT INTO TABLE f';
  return await encryptData(password, secret);
}
// Timeout helper
function timeoutPromise(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), ms)
  );
}

async function sendPacketWithRetry(service, payload, maxAttempts = 3) {
  const TIMEOUT_MS = 7000;

  function timeoutPromise(ms) {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), ms)
    );
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await Promise.race([
        fetch('http://localhost:3000/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ service, ...payload })
        }),
        timeoutPromise(TIMEOUT_MS)
      ]);

      const result = await response.json();
      return result;
    } catch (error) {
      const isTimeout = error.message.includes('timed out');
      const isNetwork = error.message.includes('Network');

      const shouldRetry = isTimeout || isNetwork;

      console.warn(`⚠️ Attempt ${attempt} failed: ${error.message}`);

      if (!shouldRetry || attempt === maxAttempts) {
        return { error: isTimeout ? 'timeout' : 'network error' };
      }

      // ⏳ Exponential backoff
      const backoff = 500 * Math.pow(2, attempt - 1);
      await new Promise(res => setTimeout(res, backoff));
    }
  }
}


//  Registration
export async function registerRequest(setOfData) {
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

  const encryptedPass = await encryptPass(password, email);

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
