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
exports.setupExportHandlers = setupExportHandlers;
const electron_1 = require("electron");
const constants_1 = require("../utils/constants");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dialog_1 = require("../utils/dialog");
const utils_1 = require("../utils");
function setupExportHandlers() {
    electron_1.ipcMain.handle("file-downloaded", (_, filePath) => __awaiter(this, void 0, void 0, function* () {
        const fileName = path_1.default.basename(filePath);
        const destinationPath = path_1.default.join(constants_1.downloadsDir, fileName);
        yield fs_1.default.promises.rename(filePath, destinationPath);
        const success = yield (0, dialog_1.showFileDownloadedDialog)(destinationPath);
        return { success };
    }));
    electron_1.ipcMain.handle("export-as-pdf", (_, id, title) => __awaiter(this, void 0, void 0, function* () {
        const ppt_url = `${process.env.NEXT_PUBLIC_URL}/pdf-maker?id=${id}`;
        const browser = new electron_1.BrowserWindow({
            width: 1280,
            height: 720,
            icon: path_1.default.join(constants_1.baseDir, "resources/ui/assets/images/presenton_short_filled.png"),
            webPreferences: {
                webSecurity: false,
                preload: path_1.default.join(__dirname, '../preloads/index.js'),
            },
            show: false,
        });
        browser.loadURL(ppt_url);
        const success = yield new Promise((resolve, _) => {
            browser.webContents.on('did-finish-load', () => __awaiter(this, void 0, void 0, function* () {
                // Wait for 1 second to make sure the page is loaded
                yield new Promise((resolve, _) => {
                    setTimeout(resolve, 1000);
                });
                const pdfBuffer = yield browser.webContents.printToPDF({
                    printBackground: true,
                    pageSize: { width: 1280 / 96, height: 720 / 96 },
                    margins: { top: 0, right: 0, bottom: 0, left: 0 }
                });
                browser.close();
                const sanitizedTitle = (0, utils_1.sanitizeFilename)(title);
                const destinationPath = path_1.default.join(constants_1.downloadsDir, `${sanitizedTitle}.pdf`);
                yield fs_1.default.promises.writeFile(destinationPath, pdfBuffer);
                const success = yield (0, dialog_1.showFileDownloadedDialog)(destinationPath);
                resolve(success);
            }));
        });
        return { success };
    }));
}
