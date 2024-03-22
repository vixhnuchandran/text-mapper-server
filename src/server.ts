import { configDotenv } from "dotenv"
import app from "./app"
configDotenv()

const port = process.env.PORT || 3000
console.log("port", process.env.PORT)

app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`)
})
