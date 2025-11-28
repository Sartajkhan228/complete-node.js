import express from 'express'
import {
    getLoginPage, getMe, getRegisterPage, login, logout, register,
    renderHomePage, getProfile, verifyEmail, resendVerificationEmail,
    verifyEmailToken, editProfilePage, updateProfile, changePasswordPage,
    updatePassword, forgotPasswordPage,
    forgotPasswordLink, resetPassword,
    resetPasswordToken
} from '../controllers/auth.controllers.js';

const authRouter = express.Router();


authRouter.route("/register").get(getRegisterPage).post(register);
authRouter.route("/login").get(getLoginPage).post(login)
authRouter.get("/", renderHomePage);

authRouter.route("/me").get(getMe);

authRouter.route("/profile").get(getProfile);
authRouter.route("/verify-email").get(verifyEmail);
authRouter.route("/resend-verification").get(resendVerificationEmail);
authRouter.route("/verify-email-token").get(verifyEmailToken);
authRouter.route("/edit-profile").get(editProfilePage).post(updateProfile);
authRouter.route("/change-password").get(changePasswordPage).post(updatePassword);

authRouter.route("/forgot-password").get(forgotPasswordPage).post(forgotPasswordLink);
authRouter.route("/reset-password/:token").get(resetPasswordToken).post(resetPassword);

authRouter.route("/logout").get(logout)


export default authRouter;