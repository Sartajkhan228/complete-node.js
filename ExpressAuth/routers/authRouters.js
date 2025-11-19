import express from 'express'
import { getLoginPage, getRegisterPage, login, register, renderHomePage } from '../controllers/auth.controllers.js';

const authRouter = express.Router();

authRouter.get("/", renderHomePage);

authRouter.route("/register").get(getRegisterPage).post(register);
authRouter.route("/login").get(getLoginPage).post(login)


export default authRouter;