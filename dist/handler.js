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
const ocrService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        console.log("ocrService endpoint");
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const imgBuffer = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer;
        const imageName = (_b = req.file) === null || _b === void 0 ? void 0 : _b.originalname;
        const resultData = yield tesseract_js_1.default.recognize(imgBuffer, "eng");
        const extractedBboxes = resultData.data.words.map(word => ({
            [word.text]: word.bbox,
        }));
        const extractedText = resultData.data.words
            .map(word => word.text)
            .join(" ");
        console.log("extractedText: ", extractedText);
        console.log("extractedBboxes: ", extractedBboxes);
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({
            extractedText,
            extractedBboxes,
        });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to process image" });
    }
});
exports.ocrService = ocrService;
