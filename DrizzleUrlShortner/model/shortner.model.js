// import pkg from "@prisma/client"
// const { PrismaClient } = pkg

import { db } from "../config/db.js"
import { shortLink } from "../drizzle/schema.js"
import { eq } from "drizzle-orm"


export const loadLinks = async () => {

    const rows = await db.select().from(shortLink)
    return rows;
}


export const insertShortLink = async ({ url, shortCode }) => {

    await db.insert(shortLink).values({ url, shortCode })
}


export const getLinkByShortCode = async (shortCode) => {

    const [result] = await db.select().from(shortLink).where(eq(shortLink.shortCode, shortCode))
    return result
}