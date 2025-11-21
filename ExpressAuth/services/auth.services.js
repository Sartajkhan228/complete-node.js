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

export const createRefreshToken = async (sessionId) => {

    return jwt.sign({ sessionId }, process.env.JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND
    })
}


export const verifyToken = (token) => {

    return jwt.verify(token, process.env.JWT_SECRET)
}


