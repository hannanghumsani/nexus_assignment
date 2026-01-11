// frontend/utils/crypto.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = "my-secret-key-123"; // Must match backend

export const decryptData = (ciphertext) => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(originalText);
    } catch (error) {
        console.error("Decryption failed:", error);
        return [];
    }
};