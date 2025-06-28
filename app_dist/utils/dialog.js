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
exports.showFileDownloadedDialog = showFileDownloadedDialog;
const electron_1 = require("electron");
const electron_2 = require("electron");
const path_1 = __importDefault(require("path"));
function showFileDownloadedDialog(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { response } = yield electron_2.dialog.showMessageBox({
                type: 'question',
                buttons: ['Open File', 'Open Folder', 'Cancel'],
                defaultId: 0,
                title: 'File Downloaded',
                message: 'What would you like to do?'
            });
            if (response === 0) {
                yield electron_1.shell.openPath(filePath);
            }
            else if (response === 1) {
                yield electron_1.shell.openPath(path_1.default.dirname(filePath));
            }
            return true;
        }
        catch (error) {
            console.error('Error handling downloaded file:', error);
            return false;
        }
    });
}
