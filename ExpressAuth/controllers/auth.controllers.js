import { email } from "zod"
import { ACCESS_TOKEN_EXPIRY, OAUTH_EXCHANGE_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../config/constants.js"
import {
    clearUserSessionId,
    clearUserVerificationTokens,
    compareHashedPassword,
    createAccessToken,
    createRefreshToken,
    createSession,
    createUser, createUserWithOauth, deleteSelectedToken, findUserById, /* findVerificationEmailToken*/ findVerificationEmailTokenWithJoin, getPasswordResetToken, getUserByEmail, getUserWithOauthId, hashPassword,
    linkUserWithOauth,
    sendPasswordResetEmail,
    sendVerificationEmail,
    updatePasswordInDb,
    updateProfileInDb,
    userShortLinks,
    verifyUserEmailAndUpdate
} from "../services/auth.services.js"
import { deleteSelectedId, loadLinks } from "../services/urlshortner.services.js"
import { changePasswordSchema, emailSchema, emailVerificationSchema, loginUserSchema, passwordTokenVerificationSchema, registerUserSchema, resetPasswordSchema, updateProfileSchema } from "../validators/auth.validators.js"
import * as arctic from "arctic";
import { google } from "../lib/oauth/google.js"




export const renderHomePage = async (req, res) => {
    if (!req.user) return res.redirect("/login")

    const links = await loadLinks(req.user?.id)
    const errors = req.flash("errors")
    const success = req.flash("success")

    res.render("home", { links, errors, success })
}

export const getRegisterPage = async (req, res) => {
    return res.render("register", { errors: req.flash("errors") })
}

export const getLoginPage = async (req, res) => {
    res.render("login", { errors: req.flash("errors") })
}


// REGISTER

export const register = async (req, res) => {

    // if (req.user) return res.redirect("/")

    const result = registerUserSchema.safeParse(req.body);

    // here safeParse function (in result has two properties data and error)

    if (!result.success) {
        const errors = result.error.issues.map(err => err.message);
        req.flash("errors", errors)
        return res.redirect("/register")
    }

    const { name, email, password } = result.data;


    const user = await getUserByEmail(email)

    if (user) {
        req.flash("errors", "User already exists")
        return res.redirect("/register")
    }

    const hashedPassword = await hashPassword(password)

    const newUser = await createUser({ name, email, password: hashedPassword });

    const session = await createSession(newUser.id, {
        ip: req.clientId,
        userAgent: req.header("user_agent")
    })

    const accessToken = createAccessToken({
        id: newUser.id,
        name: name,
        email: email,
        isEmailVerified: false,
        sessionId: session.id
    })

    const refreshToken = createRefreshToken(session.id);

    const configData = { httpOnly: true, secure: true }

    res.cookie("access_token", accessToken, {
        ...configData,
        maxAge: ACCESS_TOKEN_EXPIRY
    })

    res.cookie("refresh_token", refreshToken, {
        ...configData,
        maxAge: REFRESH_TOKEN_EXPIRY
    })

    await sendVerificationEmail({ userId: newUser.id, email: newUser.email, name: newUser.name });

    res.redirect("/")

}

// LOGIN:

export const login = async (req, res) => {
    // res.setHeader("Set-Cookie", "isLoggedIn=true; path=/;")

    if (req.user) return res.redirect("/")

    // zod validation

    const result = loginUserSchema.safeParse(req.body);

    if (!result.success) {
        const errors = result.error.issues.map(err => err.message);
        req.flash("errors", errors)
        return res.redirect("/login")
    }

    const { email, password } = result.data;

    const user = await getUserByEmail(email);

    if (!user) {
        req.flash("errors", "Email or password is incorrect")
        return res.redirect("/login")
    }

    if (!user.password) {
        req.flash("errors", "You have loggedin using google please login again to set password")
        return res.redirect("/login")
    }

    const isMatch = await compareHashedPassword({ hashedPassword: user.password, password: password })

    if (!isMatch) {
        req.flash("errors", "Email or password is incorrect")
        return res.redirect("/login")
    }

    // res.cookie("isLoggedIn", true)

    // const token = generateToken({
    //     id: user.id,
    //     name: user.name,
    //     email: user.email
    // });

    // res.cookie("access_token", token)

    const session = await createSession(user.id, {
        ip: req.clientId,
        userAgent: req.header("user_agent")
    })

    const accessToken = createAccessToken({
        id: user.id,
        name: user.name,
        email: user.email,
        isEmailVerified: false,
        sessionId: session.id
    })

    const refreshToken = createRefreshToken(session.id)

    const baseConfig = { httpOnly: true, secure: true }


    res.cookie("access_token", accessToken, {
        // httpOnly: true,
        // secure: true,
        // or
        ...baseConfig,
        maxAge: ACCESS_TOKEN_EXPIRY
    })

    res.cookie("refresh_token", refreshToken, {
        ...baseConfig,
        maxAge: REFRESH_TOKEN_EXPIRY

    })

    res.redirect("/")
};


export const getProfile = async (req, res) => {

    if (!req.user) return res.redirect("/login")

    const user = await findUserById(req.user.id)

    if (!user) {
        console.log("User not found")
    }

    const getUserShortLinks = await userShortLinks(user.id)

    res.render("profile", {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isEmailVerified: user.isEmailVerified,
            createdAt: user.createdAt,
            links: getUserShortLinks
        }
    })
}

// render to verify email page

export const verifyEmail = async (req, res) => {

    if (!req.user) return res.redirect("/login")

    const user = await findUserById(req.user.id)

    if (!user || user.isEmailVerified) {
        return res.redirect("/")
    }

    res.render("verify-email", {
        email: user.email
    })
}

// resend verification email

export const resendVerificationEmail = async (req, res) => {

    if (!req.user) return res.redirect("/login")

    const user = await findUserById(req.user.id);

    if (!user || user.isEmailVerified) {
        return res.redirect("/")
    }

    await sendVerificationEmail({ userId: user.id, email: user.email });

    res.redirect("/verify-email")
}

// verify email token

export const verifyEmailToken = async (req, res) => {
    if (!req.user) return res.redirect("/login")

    const result = emailVerificationSchema.safeParse(req.query);

    if (!result.success) {
        return res.send("Validation failed")
    }

    const { token, email } = result.data;

    // const verifyToken = await findVerificationEmailToken({ token, email });  witout joins
    const [verifyToken] = await findVerificationEmailTokenWithJoin({ token, email });

    if (!verifyToken) {
        // req.flash("errors", "Invalid or expired verification link")
        return res.send("Verification link is invalid or expired")
    }

    await verifyUserEmailAndUpdate(verifyToken.email);

    await clearUserVerificationTokens(verifyToken.email);

    res.redirect("/profile")

}

// edit profile page;

export const editProfilePage = async (req, res) => {

    if (!req.user) return res.redirect("/login")

    const user = await findUserById(req.user.id);

    if (!user) {
        return res.redirect("/login")
    }

    res.render("editProfile", {
        name: user.name,
        email: user.email,
        errors: req.flash("errors")
    })
}

export const updateProfile = async (req, res) => {
    if (!req.user) return res.redirect("/login")

    const result = updateProfileSchema.safeParse(req.body);

    if (!result.success) {
        const errors = result.error.issues.map(err => err.message);
        req.flash("errors", errors)
        return res.redirect("/edit-profile")
    }

    const { name, email } = result.data;

    // update user in db
    const user = await findUserById(req.user.id);
    if (!user) {
        req.flash("errors", "User not found")
        return res.redirect("/edit-profile")
    }
    // check if email is changing and if new email already exists
    if (email !== user.email) {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            req.flash("errors", "Email already in use")
            return res.redirect("/edit-profile")
        }
    }

    await updateProfileInDb(req.user.id, { name, email });

    res.redirect("/profile")

}


export const getMe = async (req, res) => {

    if (!req.user) return res.send("User not logged in")

    res.send(`<h1> Hey! ${req.user.name} - ${req.user.email}</h1>`)
}



// Logout

export const logout = async (req, res) => {

    await clearUserSessionId(req.user.sessionId)

    res.clearCookie("access_token")
    res.clearCookie("refresh_token")

    res.redirect("/login")
}

export const changePasswordPage = async (req, res) => {
    if (!req.user) return res.redirect("/login")

    const errors = req.flash("errors")
    const success = req.flash("success")

    res.render("changePassword", {
        errors, success
    })
}


export const updatePassword = async (req, res) => {
    if (!req.user) return res.redirect("/login")

    const result = changePasswordSchema.safeParse(req.body);

    if (!result.success) {
        const errors = result.error.issues.map(err => err.message);
        req.flash("errors", errors)
        return res.redirect("/change-password")
    }

    const { currentPassword, newPassword } = result.data;

    const user = await findUserById(req.user.id);

    if (!user) {
        req.flash("errors", "User not found")
        return res.redirect("/change-password")
    }

    const isMatch = await compareHashedPassword({ hashedPassword: user.password, password: currentPassword });

    if (!isMatch) {
        req.flash("errors", "Current password is incorrect")
        return res.redirect("/change-password")
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await updatePasswordInDb(req.user.id, hashedNewPassword);

    req.flash("success", "Password updated successfully")


    res.redirect("/change-password")

}


export const forgotPasswordPage = async (req, res) => {

    const errors = req.flash("errors");
    const success = req.flash("success");

    res.render("forgotPassword", { errors, formSubmitted: success })
}

export const forgotPasswordLink = async (req, res) => {

    const result = emailSchema.safeParse(req.body);

    if (!result.success) {
        const errors = result.error.issues.map(err => err.message);
        req.flash("errors", errors)
        return res.redirect("/forgot-password")
    }

    const { email } = result.data;

    console.log("USER EMAIL", email)

    const user = await getUserByEmail(email);

    if (!user) {
        req.flash("errors", "If the email exists, a reset link has been sent")
        return res.redirect("/forgot-password")
    }

    await sendPasswordResetEmail({ userId: user.id, email: user.email, name: user.name })
    // await sendVerificationEmail({ userId: user.id, email: user.email })

    req.flash("success", "If the email exists, a reset link has been sent")
    res.redirect("/forgot-password")

}


export const resetPasswordToken = async (req, res) => {

    const { token } = req.params;

    const passwordResetToken = await getPasswordResetToken(token);

    if (!passwordResetToken) {
        return res.render("invalid-token")
    }

    const errors = req.flash("errors")
    const success = req.flash("success")

    res.render("resetPasswordPage", {
        errors,
        success,
        token
    })

}


export const resetPassword = async (req, res) => {

    const { token } = req.params;

    const inputUserData = await getPasswordResetToken(token)

    if (!inputUserData) {
        return res.send("token is invlid or expired")
    }

    const result = resetPasswordSchema.safeParse(req.body);

    if (!result.success) {
        const errors = result.error.issues.map(err => err.message);
        req.flash("errors", errors)
        return res.redirect("/reset-password")
    }

    const { password } = result.data;

    const user = await findUserById(inputUserData.userId);

    if (!user) {
        req.flash("errors", "User not found")
        return res.redirect("/reset-password")
    }

    await deleteSelectedToken(user.id)

    const hashedPassword = await hashPassword(password);

    await updatePasswordInDb(user.id, hashedPassword);

    // assining the tokens to the user

    const session = await createSession(user.id, {
        ip: req.clientId,
        userAgent: req.header("user_agent")
    })

    const accessToken = createAccessToken({
        id: user.id,
        name: user.name,
        email: user.email,
        sessionId: session.id
    })

    const refreshToken = createRefreshToken(session.id)

    const baseConfig = { httpOnly: true, secure: true }

    res.cookie("access_token", accessToken, {
        ...baseConfig,
        maxAge: ACCESS_TOKEN_EXPIRY
    })

    res.cookie("refresh_token", refreshToken, {
        ...baseConfig,
        maxAge: REFRESH_TOKEN_EXPIRY
    })

    req.flash("success", "Password reset successfully")

    res.redirect("/")

}


export const getGoogleLoginPage = async (req, res) => {

    if (req.user) return res.redirect("/")

    const state = arctic.generateState();
    const codeVerifier = arctic.generateCodeVerifier();
    const url = google.createAuthorizationURL(state, codeVerifier, [
        "openid", "profile", "email"
    ])

    // setCookie("state", state, {
    //     secure: true,
    //     path: "/",
    //     httpOnly: true,
    //     maxAge: OAUTH_EXCHANGE_EXPIRY
    // });

    // setCookie("code_verifier", codeVerifier, {
    //     secure: true,
    //     path: "/",
    //     httpOnly: true,
    //     maxAge: OAUTH_EXCHANGE_EXPIRY
    // });

    const cookieConfig = {
        httpOnly: false,
        secure: true,
        maxAge: OAUTH_EXCHANGE_EXPIRY,
        sameSite: "lax"
    }

    res.cookie("google_oauth_state", state, cookieConfig)
    res.cookie("google_code_verifier", codeVerifier, cookieConfig)

    res.redirect(url.toString());
}


export const getGoogleCallback = async (req, res) => {

    const { code, state } = req.query;
    console.log("CODE AND STATE", code, state)

    const {
        google_oauth_state: storedState,
        google_code_verifier: codeVerifier,
    } = req.cookies;

    if (!code ||
        !state ||
        !storedState ||
        !codeVerifier ||
        state !== storedState
    ) {
        req.flash("errors", "Coudn't login with google because of invalid login attempt. Please try again!");
        return res.redirect("/login")
    }


    let tokens;

    try {

        tokens = await google.validateAuthorizationCode(code, codeVerifier)

    } catch (error) {
        req.flash("errors", "Coudn't login with google because of invalid login attempt. Please try again!");
        res.redirect("/login")

    }

    console.log("TOKEN", tokens)

    const claims = arctic.decodeIdToken(tokens.idToken());
    const { sub: googleUserId, name, email } = claims;

    // user create account using google login and want to just signin:
    let user = await getUserWithOauthId({
        provider: "google",
        email,
    })

    // User created account using email manually first, and then after want to login with google using the same email as he used to register manually:

    if (user && !user.providerAccountId) {

        await linkUserWithOauth({
            userId: user.id,
            provider: "google",
            providerAccountId: googleUserId
        })
    }

    // User want to login the with the google in first time:
    if (!user) {
        user = await createUserWithOauth({
            name,
            email,
            provider: "google",
            providersAccountId: googleUserId
        })
    }

    const session = await createSession(user.id, {
        ip: req.clientId,
        userAgent: req.header("user_agent")
    })

    const accessToken = createAccessToken({
        id: user.id,
        name: user.name,
        email: user.email,
        sessionId: session.id
    })

    const refreshToken = createRefreshToken(session.id)

    const baseConfig = { httpOnly: true, secure: true }

    res.cookie("access_token", accessToken, {
        ...baseConfig,
        maxAge: ACCESS_TOKEN_EXPIRY
    })

    res.cookie("refresh_token", refreshToken, {
        ...baseConfig,
        maxAge: ACCESS_TOKEN_EXPIRY
    })

    res.redirect("/")
}