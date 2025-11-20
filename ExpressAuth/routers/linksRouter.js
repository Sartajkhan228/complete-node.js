
import express from 'express';
import { postShortLink, redirectShortLink } from '../controllers/shortlink.controller.js';


const linkRouter = express.Router();

linkRouter.post("/", postShortLink);
linkRouter.get("/:shortCode", redirectShortLink);


export default linkRouter;