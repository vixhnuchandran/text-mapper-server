import express, { Router, urlencoded } from "express"
import cors from "cors"
import routes from "./routes"
import bodyParser from "body-parser"

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use("/", routes)

export default app
