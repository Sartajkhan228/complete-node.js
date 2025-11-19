import {
    createUser, getUserByEmail, hashPassword
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
    console.log(userExist)
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

    const hash = compareHashedPassword(user.password, password)

    if (user.password !== password) {
        return res.redirect("/login")

    }

    res.cookie("isLoggedIn", true)
    res.render("home")
}