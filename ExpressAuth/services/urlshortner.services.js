import { db } from "../config/db.js";
import { eq } from "drizzle-orm"
import { shortLink } from "../drizzle/schema.js";

export const loadLinks = async (userId) => {

    const rows = await db.select().from(shortLink).where(eq(shortLink.userId, userId))
    return rows;
}


export const insertShortLink = async ({ url, shortCode, userId }) => {

    await db.insert(shortLink).values({ url, shortCode, userId })
}


export const getLinkByShortCode = async (shortCode) => {

    const [result] = await db.select().from(shortLink).where(eq(shortLink.shortCode, shortCode))
    return result
}