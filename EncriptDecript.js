require('dotenv').config();
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const sec_for_crypto = process.env.SEC_FOR_CRYPTO
const iv = crypto.randomBytes(16);
function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(sec_for_crypto, 'hex'), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return encrypted.toString('hex');
}
function decrypt(hash) {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(sec_for_crypto, 'hex'), Buffer.from(iv.toString('hex'), 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]);
    // console.log("tis is butter", decrypted);
    return decrypted.toString();
}

console.log(encrypt("a2@gmail.com"));
// console.log("This you Entred : ", decrypt(encrypt("a2@gmail.com")));
console.log("This you decrypt : ", decrypt("e3b981cc6ed19a967ec65e9e"));

module.exports = { encrypt };
