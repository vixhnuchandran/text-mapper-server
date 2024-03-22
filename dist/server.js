"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const app_1 = __importDefault(require("./app"));
(0, dotenv_1.configDotenv)();
const port = process.env.PORT || 3000;
console.log("port", process.env.PORT);
app_1.default.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});
