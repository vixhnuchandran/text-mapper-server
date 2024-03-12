import { Request, Response, NextFunction, Router } from "express"
import Tesseract from "tesseract.js"

const ocrService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("ocrService endpoint")
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" })
        }

        const imgBuffer = req.file?.buffer
        const imageName = req.file?.originalname

        const resultData = await Tesseract.recognize(imgBuffer, "eng")

        const extractedBboxes = resultData.data.words.map(word => ({
            [word.text]: word.bbox,
        }))
        const extractedText = resultData.data.words
            .map(word => word.text)
            .join(" ")

        console.log("extractedText: ", extractedText)
        console.log("extractedBboxes: ", extractedBboxes)

        res.setHeader("Content-Type", "application/json")
        res.status(200).json({
            extractedText,
            extractedBboxes,
        })
    } catch (error) {
        console.error("Error:", error)
        res.status(500).json({ error: "Failed to process image" })
    }
}

export { ocrService }
