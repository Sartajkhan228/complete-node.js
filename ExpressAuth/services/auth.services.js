import { ACCESS_TOKEN_EXPIRY, MILLISECONDS_PER_SECOND, REFRESH_TOKEN_EXPIRY } from "../config/constants.js";
import { db } from "../config/db.js"
import { sessionsTable, usersTable } from "../drizzle/schema.js"
import { eq } from "drizzle-orm"
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

    return await db.insert(usersTable).values({ name, email, password })

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

    return session;
}

// findUserById
export const findUserById = async (userId) => {
    const [user] = await db.select().from(usersTable).where(usersTable.id, userId);

    return user
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


