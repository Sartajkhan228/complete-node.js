import { findShortlinkById, getLinkByShortCode, insertShortLink, loadLinks, updateShortLinkById } from "../services/urlshortner.services.js";
import crypto from 'crypto';
import { linkValidationSchema } from "../validators/auth.validators.js";
import z from "zod";


export const postShortLink = async (req, res) => {

    try {

        // zod validation
        const result = linkValidationSchema.safeParse(req.body);

        if (!result.success) {
            const error = result.error.issues.map(err => err.message).join(", ")
            req.flash("errors", error)
            res.redirect("/")
        }

        const { url, shortCode } = result.data;
        const userId = req.user?.id

        const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

        const links = await loadLinks(userId);
        const exists = links.find((link) => link.shortCode === finalShortCode)

        if (exists) {
            req.flash("errors", "Short code already exists, Please chose another one")
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

    if (!link) return res.status(404).send("link not found");

    res.redirect(link.url)

}


export const updateShortLink = async (req, res) => {

    if (!req.user) return res.redirect("/login")

    const result = linkValidationSchema.safeParse(req.body);

    if (!result.success) {
        const error = result.error.issues.map(err => err.message).join(", ")
        req.flash("errors", error)
        res.redirect("/")
    }

    const { url, shortCode } = result.data;

    const idResult = z.coerce.number().int().safeParse(req.params.id);

    if (!idResult.success) {
        return res.status(404).render("404")
    }

    const id = idResult.data

    try {
        const existingShortlink = await findShortlinkById(id);
        if (!existingShortlink) {
            return res.status(404).render("404")
        }

        const allLinks = await loadLinks(req.user.id);
        const sameLink = allLinks.find((link) => link.shortCode === shortCode && link.id !== id)

        if (sameLink) {
            res.flash("errors", "Shortcode already exits, Please chose anoter one")
            return res.redirect(`/update/${id}`)
        }

        await updateShortLinkById(id, { url, shortCode });

        req.flash("success", "Short link updated successfully!");
        // res.redirect(`/update/${id}`);
        res.redirect("/")

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }

}


export const getShortlinkUpdatePage = async (req, res) => {

    if (!req.user) return res.redirect("/login")


    const result = z.coerce.number().int().safeParse(req.params.id);

    if (!result.success) {
        return res.status(404).render("404");
    }

    try {
        const shortLink = await findShortlinkById(result.data)
        console.log("shortLink", shortLink)
        if (!shortLink) return res.status(404).send("Page not found")


        res.render("update", {
            id: result.data,
            url: shortLink.url,
            shortCode: shortLink.shortCode,
            errors: req.flash("errors")
        })


    } catch (error) {
        console.error(error)
        return res.status(500).send("Internal server error")
    }

}