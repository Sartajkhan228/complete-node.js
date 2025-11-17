import { urlencoded } from "express"
import express from "express"
// import { urlencoded } from "express"
import { get404 } from "./controllers/error.contriller.js"
import urlRoute from "./routes/urlRoutes.js"


const app = express()
// app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.set("view engine", "ejs")

app.use(urlRoute)
app.use(get404)

const port = process.env.PORT

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`)
})