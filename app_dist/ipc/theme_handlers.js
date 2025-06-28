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
exports.setupThemeHandlers = setupThemeHandlers;
const electron_1 = require("electron");
const settings_store_1 = require("../services/settings-store");
const THEME_KEY = 'theme';
function setupThemeHandlers() {
    electron_1.ipcMain.handle('get-theme', () => __awaiter(this, void 0, void 0, function* () {
        try {
            const theme = settings_store_1.settingsStore.get(THEME_KEY);
            return { theme };
        }
        catch (error) {
            console.error('Error retrieving theme:', error);
            throw error;
        }
    }));
    electron_1.ipcMain.handle('set-theme', (_, themeData) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (!themeData) {
                throw new Error('Theme data is required');
            }
            settings_store_1.settingsStore.set(THEME_KEY, themeData);
            return { success: true };
        }
        catch (error) {
            console.error('Error saving theme:', error);
            throw error;
        }
    }));
}
