import { db } from "../config/db.js"
import { usersTable } from "../drizzle/schema.js"
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

    // const hashedPassword = crypto.hash(256).toString('hex')

    return await db.insert(usersTable).values({ name, email, password })

}

export const generateToken = async ({ id, name, email }) => {

    return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

};


