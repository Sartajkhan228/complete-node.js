import express from 'express'
import { getLoginPage, getRegisterPage, login, renderHomePage } from '../controllers/auth.controllers.js';

const authRouter = express.Router();

authRouter.get("/home", renderHomePage);
authRouter.get("/register", getRegisterPage);
authRouter.get("/login", getLoginPage);
authRouter.post("/login", login)



export default authRouter;