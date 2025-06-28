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
exports.setupUploadImage = setupUploadImage;
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const constants_1 = require("../utils/constants");
function setupUploadImage() {
    electron_1.ipcMain.handle("upload-image", (_, file) => __awaiter(this, void 0, void 0, function* () {
        try {
            // Create uploads directory if it doesn't exist
            const uploadsDir = path_1.default.join(constants_1.userDataDir, "uploads");
            fs_1.default.mkdirSync(uploadsDir, { recursive: true });
            // Generate unique filename
            const filename = `${crypto_1.default.randomBytes(16).toString('hex')}.png`;
            const filePath = path_1.default.join(uploadsDir, filename);
            // Write file to disk
            yield fs_1.default.writeFileSync(filePath, file);
            // Return the relative path that can be used in the frontend
            return filePath;
        }
        catch (error) {
            console.error("Error saving image:", error);
            throw error;
        }
    }));
}
