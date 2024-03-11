"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ocrService = void 0;
const tesseract_js_1 = __importDefault(require("tesseract.js"));
const canvas_1 = require("canvas");
const ocrService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        console.log("ocrService endpoint");
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const imgBuffer = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer;
        const imageName = (_b = req.file) === null || _b === void 0 ? void 0 : _b.originalname;
        const img = yield (0, canvas_1.loadImage)(imgBuffer);
        const canvas = (0, canvas_1.createCanvas)(img.width, img.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const { data: { words, lines }, } = yield tesseract_js_1.default.recognize(imgBuffer, "eng");
        const data = { words, lines };
        drawBoundingBoxes(ctx, data.words);
        const extractedText = words.map(word => word.text).join(" ");
        const dataUrl = canvas.toDataURL("image/png");
        const byteString = atob(dataUrl.split(",")[1]);
        const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const file = new File([blob], "processed_image.png");
        const processedImageBuffer = yield convertFileToBuffer(file);
        const base64Data = processedImageBuffer.toString("base64");
        console.log("extractedText: ", extractedText);
        console.log("processedImage: ", base64Data);
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({
            extractedText,
            processedImage: base64Data,
        });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to process image" });
    }
});
exports.ocrService = ocrService;
const convertFileToBuffer = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return Buffer.from(yield file.arrayBuffer());
});
const drawBoundingBoxes = (ctx, words) => {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    for (const word of words) {
        const { x0, y0, x1, y1 } = word.bbox;
        ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
    }
};
