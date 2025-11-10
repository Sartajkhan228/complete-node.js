import express from 'express'
import mongoose from 'mongoose';

const app = express()
app.use(express.json());

const DATABASE_URI = ""

mongoose.connect(DATABASE_URI).then(() => {
    console.log("✅ Connected to database")
}).catch((error) => {
    console.log("❌ Error connecting database", error)
})

app.get("/", (req, res) => {
    res.send(`<h1>Api is working</h1>`)
})

const PORT = 5005

app.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT}`)
})