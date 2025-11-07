import express from 'express';
import path from 'path';
import { ensureAsyncFunc, shortnerRouter } from './routes/urlshortenerRoutes.js';

const app = express();
app.use(express.json());


// app.use(express.static("public"));
// or
const staticPath = path.join(import.meta.dirname, "public")
app.use(express.static(staticPath))


app.use("/", shortnerRouter)


const PORT = 3003;
ensureAsyncFunc().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
})
