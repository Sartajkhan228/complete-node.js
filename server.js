import express from 'express';
import add from './math.js';
import { subtract, multiply, divide, PI } from './math1.js';
import os from 'os';
import { generateCryptoBytes, generateHash, generateHash1 } from './crypto.js';
import { readFile, updateFile, writeFile } from './fsModules.js';


const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
})

// os module examples
console.log("CPU Architecture:", os.arch());
console.log("Total Memory:", os.totalmem());
console.log("FREE Memory:", os.freemem());

// Crypto examples
console.log("Crypto bytes", generateCryptoBytes)
console.log("Crypto hashed", generateHash)
console.log("Crypto hashed1", generateHash1)

// Math examples
console.log(add(2, 4));
console.log(subtract(2, 4));
console.log(multiply(2, 4));
console.log(divide(2, 4));
console.log(PI);

// fs module example
console.log("write file", writeFile)
console.log("Read file", readFile)
console.log("Update file", updateFile)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})