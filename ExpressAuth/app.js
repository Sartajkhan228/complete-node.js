import express from 'express'
import authRouter from './routers/authRouters.js'
import cookieParser from 'cookie-parser'
import { verifyAuthentication } from './middlewares/verify-auth-middleware.js';
import requestIp from "request-ip"
import session from 'express-session';
import flash from 'connect-flash';
import linkRouter from './routers/linksRouter.js';


const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set("view engine", "ejs")

// We use cookie parser to get cookies from client request
app.use(cookieParser());

// to hangle errors
app.use(session({ secret: "my-secret", resave: true, saveUninitialized: false }));
app.use(flash());


// this is the middleware due to this middleware we able to call req.clientIp method anywhere;
// this is very usefull middleware used to get the ip of the user;
app.use(requestIp.mw());

// middleware
app.use(verifyAuthentication)
app.use((req, res, next) => {
    res.locals.user = req.user

    next()
})

app.use("/", authRouter);
app.use("/", linkRouter);

// app.use((req, res) => {
//     res.render("404")
// });

const port = process.env.PORT

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`)
})