import express from 'express';
import dotenv from 'dotenv'
import add from './math.js';
import { subtract, multiply, divide, PI } from './math1.js';
import os from 'os';
import { generateCryptoBytes, generateHash, generateHash1 } from './crypto.js';
// import { readFile, updateFile, writeFile } from './fsModules.js';
// import emitter from './tasks/events.js';
// import eventEmitter from './eventTask.js';
import { promises as fs } from 'fs'
import z, { email } from 'zod';
// import { getWeather } from './miniprojects/weather.js';
// import { fetchApi } from './miniprojects/currency_converter.js';
// import { getJokes } from './miniprojects/joke_generator.js';
// import { fileCreation } from './miniprojects/cliFileCreation.js';
// import { showMenu } from './miniprojects/cliCrud.js';


const app = express();
app.use(express.json())
dotenv.config();

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
// fileCreation()

// Fetching api through cli
// getJokes()

// Fetching API to get currency values
// fetchApi()


// Fetching Api to get weather data
// getWeather()


app.get("/contact", (req, res) => {

    res.send(`
          <div class="container">
        <h1>Url shortner</h1>

        <form  id="shorten-form">
            <div class="input_box">
                <label for="url">Enter Url:</label>
                <input type="url" name="url" id="url" required>
            </div>
            <div class="input_box">
                <label for="shortCode">Custom short url(optional)</label>
                <input type="text" name="shortCode" id="shortCode">
            </div>
            <button type="submit">Shorten</button>
        </form>

        <h2>Shortend URLs</h2>
        <ul id="shortened_urls"> </ul>
    </div>
        `)
})


// zod validatin

const userSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    age: z.number().min(18, "Age must be at least 18"),
});

app.post("/api/register", (req, res) => {

    const result = userSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: result.error.errors.map(item => item.message)
        })
    }
    res.status(200).json({
        message: "User registered successfully",
        data: result.data,
    })
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\nServer is running on http://localhost:${PORT}`);
})