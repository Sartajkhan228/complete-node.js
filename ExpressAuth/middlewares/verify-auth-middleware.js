import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../config/constants.js";
import { refreshTokens, verifyJwtToken } from "../services/auth.services.js";


// export const verifyAuthentication = (req, res, next) => {

//     const token = req.cookies.access_token;

//     if (!token) {
//         req.user = null;
//         return next()
//     }

//     try {
//         const decodedToken = verifyToken(token)
//         req.user = decodedToken;

//     } catch (error) {
//         req.user = null
//     }

//     return next()
// }

export const verifyAuthentication = async (req, res, next) => {

    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    // console.log("Access Token Type:", typeof accessToken, "Value:", accessToken);
    // console.log("Refresh Token Type:", typeof refreshToken, "Value:", refreshToken);

    req.user = null

    if (!accessToken && !refreshToken) {
        return next()
    }

    if (accessToken) {
        const decodedToken = verifyJwtToken(accessToken)
        req.user = decodedToken
        return next();
    }

    if (refreshToken) {
        try {

            const data = await refreshTokens(refreshToken);

            if (!data) {
                return res.redirect("/login")
            }

            const { newAssessToken, newRefreshToken, user } = data;

            req.user = user

            const baseConfig = { httpOnly: true, secure: true }

            res.cookie("access_token", newAssessToken, {
                // httpOnly: true,
                // secure: true,
                // or
                ...baseConfig,
                maxAge: ACCESS_TOKEN_EXPIRY
            })

            res.cookie("refresh_token", newRefreshToken, {
                ...baseConfig,
                maxAge: REFRESH_TOKEN_EXPIRY

            })

            return next();

        } catch (error) {
            console.log(error)
        }

    }

    return next()

}