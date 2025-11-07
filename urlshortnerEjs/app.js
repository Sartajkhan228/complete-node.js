import express from 'express';
import path from 'path';
import { ensureAsyncFunc, shortnerRouter } from './routes/urlshortenerRoutes.js';
import { ejsRouter } from './routes/ejsRoute.js';

const app = express();
app.use(express.json());

app.set("view engine", "ejs")

// app.use(express.static("public"));
// or
const staticPath = path.join(import.meta.dirname, "public")
app.use(express.static(staticPath))


app.use("/", shortnerRouter)
app.use("/api", ejsRouter)


const PORT = 3005;
ensureAsyncFunc().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
})
