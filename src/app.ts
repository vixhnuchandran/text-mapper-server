import express, { Router, urlencoded } from "express"
import cors from "cors"
import routes from "./routes"
import bodyParser from "body-parser"

const router = Router()

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

router.get("/", (req, res) => {
    res.status(200).send("Text Mapper Server")
})

app.use("/", routes)

export default app
