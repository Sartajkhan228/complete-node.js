import express from 'express'
import authRouter from './routers/authRouters.js'
import cookieParser from 'cookie-parser'
import { verifyAuthentication } from './middlewares/verify-auth-middleware.js';
import session from 'express-session';
import flash from 'connect-flash';


const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set("view engine", "ejs")

// We use cookie parser to get cookies from client request
app.use(cookieParser());

// to hangle errors
app.use(session({ secret: "my-secret", resave: true, saveUninitialized: false }));
app.use(flash());

// middleware
app.use(verifyAuthentication)
app.use((req, res, next) => {
    res.locals.user = req.user

    return next()
})


app.use("/", authRouter)


const port = process.env.PORT

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`)
})