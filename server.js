import express from 'express';
import add from './math.js';
import { subtract, multiply, divide, PI } from './math1.js';
import os from 'os';
import { generateCryptoBytes, generateHash, generateHash1 } from './crypto.js';
// import { readFile, updateFile, writeFile } from './fsModules.js';
import emitter from './events.js';
// import eventEmitter from './eventTask.js';
import { promises as fs } from 'fs'
import { fileCreation } from './cliFileCreation.js';
// import { showMenu } from './cliCrud.js';


const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
})

// os module examples
// console.log("CPU Architecture:", os.arch());
// console.log("Total Memory:", os.totalmem());
// console.log("FREE Memory:", os.freemem());

// Crypto examples
// console.log("Crypto bytes", generateCryptoBytes)
// console.log("Crypto hashed", generateHash)
// console.log("Crypto hashed1", generateHash1)

// Math examples
// console.log(add(2, 4));
// console.log(subtract(2, 4));
// console.log(multiply(2, 4));
// console.log(divide(2, 4));
// console.log(PI);

// fs module example
// console.log("write file", writeFile)
// console.log("Read file", readFile)
// console.log("Update file", updateFile)

// emitter.emit("greet", "Sartaj", "event emitter");

// emitter.emit("eventFuction", { name: "Sartaj", age: 23 });


// event task examples
// eventEmitter.emit("user-login", { username: "Sartaj" });
// eventEmitter.emit("user-purchase", { productPurchase: "laptop" });
// eventEmitter.emit("profile-update", { profileUpdate: "email" });
// eventEmitter.emit("user-logout", { username: "Sartaj" });
// eventEmitter.emit("summary-event");


// synchronus and asynchronus code

// synchrous tasks perform googles v8 engine and Asynchrous tasks handle by Libuv(the C++ library able to handle eventloop and thread pool)
// main thread handles small tasks like synchrous code while thread pool handles Async operations
// console.log("start")

// const asyncFunc = async () => {
//     const data = await fs.readFile("D:\example.txt", "utf-8")
//     console.log("async data", data)
// }
// asyncFunc();

// console.log("End")


// creating crud at command line interface(CLI)
// showMenu()

// Creating file using Command Line Interface(CLI)
fileCreation()





const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    // console.log(`\nServer is running on port ${PORT}`);
})