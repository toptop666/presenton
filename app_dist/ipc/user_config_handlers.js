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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupUserConfigHandlers = setupUserConfigHandlers;
const electron_1 = require("electron");
const utils_1 = require("../utils");
function setupUserConfigHandlers() {
    electron_1.ipcMain.handle("get-user-config", (_, __) => __awaiter(this, void 0, void 0, function* () {
        return (0, utils_1.getUserConfig)();
    }));
    electron_1.ipcMain.handle("set-user-config", (_, userConfig) => __awaiter(this, void 0, void 0, function* () {
        (0, utils_1.setUserConfig)(userConfig);
    }));
}
