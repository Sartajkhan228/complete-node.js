
import express from 'express';
import { postShortLink, redirectShortLink, updateShortLink, getShortlinkUpdatePage, deleteShortlink } from '../controllers/shortlink.controller.js';


const linkRouter = express.Router();

linkRouter.post("/link", postShortLink);
linkRouter.get("/:shortCode", redirectShortLink);

linkRouter.route("/update/:id").get(getShortlinkUpdatePage).post(updateShortLink);

linkRouter.route("/delete/:id").post(deleteShortlink);


export default linkRouter;