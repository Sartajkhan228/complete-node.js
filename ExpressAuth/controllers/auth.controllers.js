import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../config/constants.js"
import {
    clearUserSessionId,
    compareHashedPassword,
    createAccessToken,
    createRefreshToken,
    createSession,
    createUser, findUserById, getUserByEmail, hashPassword,
    userShortLinks
} from "../services/auth.services.js"
import { loadLinks } from "../services/urlshortner.services.js"
import { loginUserSchema, registerUserSchema } from "../validators/auth.validators.js"

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

    // res.redirect("/login")

    const session = await createSession(newUser.id, {
        ip: req.clientId,
        userAgent: req.header("user_agent")
    })

    const accessToken = createAccessToken({
        id: newUser.id,
        name: name,
        email: email,
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
            createdAt: user.createdAt,
            links: getUserShortLinks
        }
    })
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




