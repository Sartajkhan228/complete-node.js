import crypto from 'crypto'
import { getLinkByShortCode, insertShortLink, loadLinks } from '../model/shortner.model.js';


export const renderHome = async (req, res) => {
    res.render("home")
}

export const postShortLink = async (req, res) => {

    try {
        const { url, shortCode } = req.body;

        const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

        const links = await loadLinks();
        const exists = links.find((link) => link.short_code === finalShortCode)

        if (exists) {
            return res.status(400).send(`
              <h1>Short code already exists!</h1>
              <a href="/">Go to home</a>
                `);
        }

        await insertShortLink({ url, shortCode: finalShortCode });

        res.send(`
             <h2>Short link created!</h2>
             <p><a href="/${finalShortCode}" target="_blank">http://localhost:/${finalShortCode}</a></p>
             <a href="/">Back to Home</a>
           `);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("<h1>Internal Server Error</h1>");
    }

}


export const redirectShortLink = async (req, res) => {

    const { shortCode } = req.params;
    const link = await getLinkByShortCode(shortCode);

    if (!link) return res.status(404).send("Link not found!");

    res.redirect(link.url)

}