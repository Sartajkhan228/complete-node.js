import express from 'express'
import { getLoginPage, getMe, getRegisterPage, login, logout, register, renderHomePage } from '../controllers/auth.controllers.js';

const authRouter = express.Router();

authRouter.get("/", renderHomePage);

authRouter.route("/register").get(getRegisterPage).post(register);
authRouter.route("/login").get(getLoginPage).post(login)

authRouter.route("/me").get(getMe)
authRouter.route("/logout").get(logout)


export default authRouter;