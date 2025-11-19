import express from 'express'
import authRouter from './routers/authRouters.js'
import cookieParser from 'cookie-parser'


const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set("view engine", "ejs")

// We use cookie parser to get cookies from client request
app.use(cookieParser());


app.use("/", authRouter)


const port = process.env.PORT

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`)
})