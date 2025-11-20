
import express from 'express';
import { postShortLink, redirectShortLink, updateShortLink, getShortlinkUpdatePage } from '../controllers/shortlink.controller.js';


const linkRouter = express.Router();

linkRouter.post("/link", postShortLink);
linkRouter.get("/:shortCode", redirectShortLink);

linkRouter.route("/update/:id").get(getShortlinkUpdatePage).post(updateShortLink)


export default linkRouter;