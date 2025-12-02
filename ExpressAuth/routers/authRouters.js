import express from 'express'
import {
    getLoginPage, getMe, getRegisterPage, login, logout, register,
    renderHomePage, getProfile, verifyEmail, resendVerificationEmail,
    verifyEmailToken, editProfilePage, updateProfile, changePasswordPage,
    updatePassword, forgotPasswordPage, forgotPasswordLink, resetPassword,
    resetPasswordToken, getGoogleLoginPage, getGoogleCallback, getGithubLoginPage,
    getGithubCallback, setPasswordPage, setPassword
} from '../controllers/auth.controllers.js';
import multer from 'multer';
import path from 'path'

const authRouter = express.Router();


authRouter.route("/register").get(getRegisterPage).post(register);
authRouter.route("/login").get(getLoginPage).post(login)
authRouter.get("/", renderHomePage);

authRouter.route("/me").get(getMe);

authRouter.route("/profile").get(getProfile);
authRouter.route("/verify-email").get(verifyEmail);
authRouter.route("/resend-verification").get(resendVerificationEmail);
authRouter.route("/verify-email-token").get(verifyEmailToken);


// for file upload:
const avatarStorage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, path.join(import.meta.dirname, 'public/uploads/avatar'))
    },
    filename: (req, file, cd) => {
        const ext = path.extname(file.originalname);
        cd(null, `${Date.now()}_${Math.random()}${ext}`);
    }
})

const avatarFileFilter = (req, file, cd) => {
    if (file.mimetype.startsWith("image/")) {
        cd(null, true)
    } else {
        cd(new Error("only image files are allowed"), false);
    }
};

const avatarUploads = multer({
    storage: avatarStorage,
    fileFilter: avatarFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }   /*5mb*/
})


authRouter.route("/edit-profile").get(editProfilePage).post(avatarUploads.single("avatar"), updateProfile)


authRouter.route("/change-password").get(changePasswordPage).post(updatePassword);

authRouter.route("/forgot-password").get(forgotPasswordPage).post(forgotPasswordLink);
authRouter.route("/reset-password/:token").get(resetPasswordToken).post(resetPassword);

authRouter.route("/google").get(getGoogleLoginPage);
authRouter.route("/google/callback").get(getGoogleCallback)

authRouter.route("/github").get(getGithubLoginPage);
authRouter.route("/github/callback").get(getGithubCallback);

authRouter.route("/set-password").get(setPasswordPage).post(setPassword)


authRouter.route("/logout").get(logout)


export default authRouter;