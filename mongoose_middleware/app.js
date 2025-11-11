import express from "express"

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send(`<h1>Server is running</h1>`)
})

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
});