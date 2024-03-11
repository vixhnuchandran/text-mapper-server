import { Request, Response, NextFunction, Router } from "express"
import { StatusCodes as httpCodes } from "http-status-codes"
import Tesseract from "tesseract.js"
import { loadImage, createCanvas, CanvasRenderingContext2D } from "canvas"

const ocrService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("ocrService endpoint")
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" })
        }

        const imgBuffer = req.file?.buffer
        const imageName = req.file?.originalname

        const img = await loadImage(imgBuffer)
        const canvas = createCanvas(img.width, img.height)
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

        ctx.drawImage(img, 0, 0)

        const {
            data: { words, lines },
        } = await Tesseract.recognize(imgBuffer, "eng")

        const data = { words, lines }

        drawBoundingBoxes(ctx, data.words)

        const extractedText = words.map(word => word.text).join(" ")

        const dataUrl = canvas.toDataURL("image/png")
        const byteString = atob(dataUrl.split(",")[1])
        const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0]
        const ab = new ArrayBuffer(byteString.length)
        const ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
        }

        const blob = new Blob([ab], { type: mimeString })

        const file = new File([blob], "processed_image.png")
        const processedImageBuffer = await convertFileToBuffer(file)

        const base64Data = processedImageBuffer.toString("base64")

        console.log("extractedText: ", extractedText)
        console.log("processedImage: ", base64Data)

        res.setHeader("Content-Type", "application/json")
        res.status(200).json({
            extractedText,
            processedImage: base64Data,
        })
    } catch (error) {
        console.error("Error:", error)
        res.status(500).json({ error: "Failed to process image" })
    }
}

const convertFileToBuffer = async (file: File) => {
    return Buffer.from(await file.arrayBuffer())
}

const drawBoundingBoxes = (
    ctx: CanvasRenderingContext2D,
    words: Tesseract.Word[]
) => {
    ctx.strokeStyle = "red"
    ctx.lineWidth = 2

    for (const word of words) {
        const { x0, y0, x1, y1 } = word.bbox
        ctx.strokeRect(x0, y0, x1 - x0, y1 - y0)
    }
}

export { ocrService }
