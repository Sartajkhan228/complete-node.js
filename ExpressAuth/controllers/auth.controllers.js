
export const renderHomePage = async (req, res) => {
    res.render("home")
}

export const getRegisterPage = async (req, res) => {
    res.render("register")
}

export const getLoginPage = async (req, res) => {
    res.render("login")
}

// LOGIN:

export const login = async (req, res) => {
    res.setHeader("Set-Cookie", "isLoggedIn=true; path=/;")
    res.render("home")
}