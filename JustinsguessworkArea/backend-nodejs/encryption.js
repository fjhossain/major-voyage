const crypto = require('crypto');

// Constants
const IV_LENGTH = 16; // AES block size
const ALGORITHM = 'aes-256-cbc';

//  Derive a 32-byte key from email (or any identity anchor)
function generateKey(email) {
  return crypto.createHash('sha256').update(email).digest(); // 32-byte key
}

//  Encrypt password or payload
function encryptPass(password, email) {
  const key = generateKey(email);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted; // prepend IV
}

//  Decrypt server response
function decryptData(encryptedData, email) {
  const key = generateKey(email);
  const [ivHex, encryptedHex] = encryptedData.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

module.exports = {
  encryptPass,
  decryptData,
  generateKey
};
