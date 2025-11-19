import { db } from "../config/db.js"
import { usersTable } from "../drizzle/schema.js"
import { eq } from "drizzle-orm"
import argon2 from "argon2";


export const getUserByEmail = async (email) => {

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email))

    return user;
};

export const hashPassword = async (password) => {
    return await argon2.hash(password)
};

export const compareHashedPassword = async (hash, password) => {

    return await argon2.verify(hash, password)
}

export const createUser = async ({ name, email, password }) => {

    // const hashedPassword = crypto.hash(256).toString('hex')

    return await db.insert(usersTable).values({ name, email, password })

}


