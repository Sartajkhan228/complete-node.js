import express from 'express'
import { getLoginPage, getRegisterPage, login, register, renderHomePage } from '../controllers/auth.controllers.js';
import { verifyAuthentication } from '../middlewares/verify-auth-middleware.js';

const authRouter = express.Router();

authRouter.get("/", verifyAuthentication, renderHomePage);

authRouter.route("/register").get(getRegisterPage).post(register);
authRouter.route("/login").get(getLoginPage).post(login)


export default authRouter;