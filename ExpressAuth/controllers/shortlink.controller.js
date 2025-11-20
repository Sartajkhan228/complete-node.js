import { getLinkByShortCode, insertShortLink, loadLinks } from "../services/urlshortner.services.js";
import crypto from 'crypto';


export const postShortLink = async (req, res) => {

    try {
        const { url, shortCode } = req.body;
        const userId = req.user?.id

        const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

        const links = await loadLinks(userId);
        const exists = links.find((link) => link.shortCode === finalShortCode)

        if (exists) {
            req.flash("errors", "Link already exists")
            return res.redirect("/")
        }

        await insertShortLink({ url, shortCode: finalShortCode, userId });

        req.flash("success", `short link created! http://localhost:5000/${finalShortCode}`)
        return res.redirect("/")

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("<h1>Internal Server Error</h1>");
    }

}


export const redirectShortLink = async (req, res) => {

    const { shortCode } = req.params;
    console.log("shortCode", shortCode)
    const link = await getLinkByShortCode(shortCode);

    if (!link) return res.status(404).send("Link not found!");

    res.redirect(link.url)

} 