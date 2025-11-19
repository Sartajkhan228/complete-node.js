import {
    compareHashedPassword,
    createUser, generateToken, getUserByEmail, hashPassword
} from "../services/auth.services.js"

export const renderHomePage = async (req, res) => {
    res.render("home")
}

export const getRegisterPage = async (req, res) => {
    res.render("register")
}

export const getLoginPage = async (req, res) => {
    res.render("login")
}


// REGISTER

export const register = async (req, res) => {

    const { name, email, password } = req.body;

    const user = await getUserByEmail(email)
    console.log(user)
    if (user) {
        return res.redirect("/login")
    }

    const hashedPassword = await hashPassword(password)

    await createUser({ name, email, password: hashedPassword });

    res.redirect("/login")

}

// LOGIN:

export const login = async (req, res) => {
    // res.setHeader("Set-Cookie", "isLoggedIn=true; path=/;")

    const { email, password } = req.body;

    const user = await getUserByEmail(email);

    if (!user) {
        return res.redirect("/login")
    }

    const isMatch = await compareHashedPassword({ hashedPassword: user.password, password: password })

    if (!isMatch) {
        return res.redirect("/login")
    }

    // res.cookie("isLoggedIn", true)

    const token = generateToken({
        id: user.id,
        name: user.name,
        email: user.email
    });

    res.cookie("access_token", token)

    res.render("home")
}