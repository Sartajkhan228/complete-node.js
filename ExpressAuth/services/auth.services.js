import { ACCESS_TOKEN_EXPIRY, MILLISECONDS_PER_SECOND, REFRESH_TOKEN_EXPIRY } from "../config/constants.js";
import { db } from "../config/db.js"
import { sessionsTable, shortLink, usersTable } from "../drizzle/schema.js"
import { eq, is } from "drizzle-orm"
import argon2 from "argon2";
import jwt from "jsonwebtoken"


export const getUserByEmail = async (email) => {

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email))

    return user;
};

export const hashPassword = async (password) => {
    return await argon2.hash(password)
};

export const compareHashedPassword = async ({ hashedPassword, password }) => {

    return await argon2.verify(hashedPassword, password)
}

export const createUser = async ({ name, email, password }) => {

    // const [user] = await db.insert(usersTable).values({ name, email, password });
    // console.log("CREATED USER", user)
    // return user;

    // 1. Insert user and get insertId
    const result = await db.insert(usersTable).values({
        name,
        email,
        password
    });

    const insertId = result[0].insertId; // <-- MySQL auto-increment ID

    // 2. Fetch full user row
    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, insertId));

    return user;

}

// export const generateToken = ({ id, name, email }) => {

//     return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
//         expiresIn: "7d"
//     })

// };

export const createSession = async (userId, { ip, userAgent }) => {

    const [result] = await db.insert(sessionsTable).values({ userId, ip, userAgent }).$returningId();

    return result;

}

export const createAccessToken = ({ id, name, email, sessionId }) => {

    return jwt.sign({ id, name, email, sessionId }, process.env.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND
    })
}

export const createRefreshToken = (sessionId) => {

    return jwt.sign({ sessionId }, process.env.JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND
    })
}


export const verifyJwtToken = (token) => {

    return jwt.verify(token, process.env.JWT_SECRET)
}


// findSessionById

export const findSessionById = async (sessionId) => {
    const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.id, sessionId));

    console.log("SESSION", session)

    return session;
}

// findUserById
export const findUserById = async (userId) => {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

    return user;
}



// refresh token exists:

export const refreshTokens = async (refreshToken) => {

    try {

        const decodedToken = verifyJwtToken(refreshToken)
        const currentSession = await findSessionById(decodedToken.sessionId)

        if (!currentSession || !currentSession.valid) {
            throw new Error("Invalid session");
        }

        const user = await findUserById(currentSession.userId)

        if (!user) throw new Error("Invalid user");

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            isEmailVerified: user.isEmailVerified,
            sessionId: currentSession.id
        }

        const newAssessToken = createAccessToken(userData);
        const newRefreshToken = createRefreshToken(currentSession.id);

        return {
            newAssessToken,
            newRefreshToken,
            user: userData
        }


    } catch (error) {
        console.log(error.message)
        return null;
    }

}

// clearUserSessionId

export const clearUserSessionId = async (sessionId) => {

    return await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId))
}

export const userShortLinks = async (userId) => {

    const links = await db.select().from(shortLink).where(eq(shortLink.userId, userId));

    return links;

}

// reuseable function for authentication:


// export const authenticateUser = async ({ req, res, newUser, name, email }) => {

//     const session = await createSession(newUser.id, {
//         ip: req.clientId,
//         userAgent: req.header("user_agent")
//     })

//     const accessToken = createAccessToken({
//         id: newUser.id,
//         name: name || newUser.name,
//         email: email || newUser.email,
//         sessionId: session.id
//     })

//     const refreshToken = createRefreshToken(session.id);

//     const configData = { httpOnly: true, secure: true }

//     res.cookie("access_token", accessToken, {
//         ...configData,
//         maxAge: ACCESS_TOKEN_EXPIRY
//     })

//     res.cookie("refresh_token", refreshToken, {
//         ...configData,
//         maxAge: REFRESH_TOKEN_EXPIRY
//     })
// }

