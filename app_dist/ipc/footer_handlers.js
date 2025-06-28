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
exports.setupFooterHandlers = setupFooterHandlers;
const electron_1 = require("electron");
const settings_store_1 = require("../services/settings-store");
const FOOTER_KEY = 'footer';
function setupFooterHandlers() {
    electron_1.ipcMain.handle('get-footer', () => __awaiter(this, void 0, void 0, function* () {
        try {
            const properties = settings_store_1.settingsStore.get(FOOTER_KEY);
            return { properties };
        }
        catch (error) {
            console.error('Error retrieving footer properties:', error);
            throw error;
        }
    }));
    electron_1.ipcMain.handle('set-footer', (_, properties) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (!properties) {
                throw new Error('Properties are required');
            }
            settings_store_1.settingsStore.set(FOOTER_KEY, properties);
            return { success: true };
        }
        catch (error) {
            console.error('Error saving footer properties:', error);
            throw error;
        }
    }));
}
