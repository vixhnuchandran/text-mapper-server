import { Router } from "express"
import * as routeHandler from "./handler"
const routes: Router = Router()
import multer from "multer"

const upload = multer({
    storage: multer.memoryStorage(),
})
routes.get("/", (req, res) => {
    console.log("Text Mapper Server")
    res.status(200).send("Text Mapper Server")
})

routes.post("/ocr-service", upload.single("image"), routeHandler.ocrService)

export default routes
