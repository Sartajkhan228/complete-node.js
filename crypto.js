import crypto from 'crypto';

// useed to generate random bytes or identifiers.
export const generateCryptoBytes = crypto.randomBytes(16).toString('hex');

// used to create a SHA-256 hash instance.
export const generateHash = crypto.createHash('sha256').update('Hello world').digest('hex');
export const generateHash1 = crypto.createHash('sha256').update('Hello world').digest('hex');

