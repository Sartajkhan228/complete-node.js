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
import path from 'path';
// import { getWeather } from './miniprojects/weather.js';
// import { fetchApi } from './miniprojects/currency_converter.js';
// import { getJokes } from './miniprojects/joke_generator.js';
// import { fileCreation } from './miniprojects/cliFileCreation.js';
// import { showMenu } from './miniprojects/cliCrud.js';


const app = express();
app.use(express.json())
dotenv.config();
app.use(express.urlencoded({ extended: true }))

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
        <h1>Login</h1>

        <form action="/login" method="POST">
            <div class="input_box">
                <label for="name">Name</label>
                <input type="text" name="name" id="name" required>
            </div>
            <div class="input_box">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" required>
            </div>
            <button type="submit">login</button>
        </form>
   
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


// ES Modules
// In node version 20.0.0 plus we use this es modules import for files
console.log(import.meta.dirname)
console.log(import.meta.filename)

// we use it get files like this
app.use(express.static(path.join(import.meta.dirname, 'public')));

// Route parameters

app.get("/profile/:username", (req, res) => {
    console.log(req.params)
    res.send(`This is route parameter, The username is ${req.params.username}`)
});

app.get("/profile/:username/article/:slug", (req, res) => {
    const formateSlug = req.params.slug.replace(/-/g, " ")
    res.send(`<h1> Article ${req.params.username} by ${formateSlug} </h1>`)
});

// Query parameters

app.get("/cities", (req, res) => {
    console.log(req.query)
    res.send(`<h1>User searched for a city ${req.query.cities}  </h1>`)
})

app.get("/cities", (req, res) => {
    console.log(req.query)
    res.send(`<h1>User searched for a city ${req.query.page} and  ${req.query.limit} </h1>`)
})


// body parameters
app.post("/login", (req, res) => {
    console.log("form submitted", req.body)
    res.send(`your name ${req.body.name} and email is ${req.body.email}`)
    res.redirect("/")
})

app.use((req, res) => {
    return res.status(404).sendFile(path.join(import.meta.dirname, "views", "404.html"))
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\nServer is running on http://localhost:${PORT}`);
})