import { db } from "../config/db.client.js"


export const loadLinks = async () => {

    const [rows] = await db.execute(`select * from short_link`)
    return rows;
}


export const insertShortLink = async ({ url, shortCode }) => {

    const [results] = await db.execute(`insert into short_link(short_code,url) values(?,?)`, [shortCode, url]);
    return results;

}


export const getLinkByShortCode = async (shortCode) => {

    const [rows] = await db.execute(`select * from short_link where short_code=?`, [shortCode]);

    if (rows.length > 0) {
        return rows[0]
    } else {
        return null
    }
}