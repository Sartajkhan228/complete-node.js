
import express from "express"
import { postShortLink, redirectShortLink, renderHome } from "../controllers/shortner.controller.js";


const urlRoute = express.Router();

urlRoute.get("/", renderHome)
urlRoute.post("/", postShortLink);
urlRoute.get("/:shortCode", redirectShortLink)


export default urlRoute;