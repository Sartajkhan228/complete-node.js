import express from "express"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(express.json())


app.get("/", (req, res) => {
    res.send(`<h1>This is home page</h1>`)
})

const port = process.env.PORT

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`)
})