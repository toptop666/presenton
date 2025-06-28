"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsStore = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const constants_1 = require("../utils/constants");
class SettingsStore {
    constructor() {
        this.settingsPath = path_1.default.join(constants_1.userDataDir, 'settings.json');
        this.settings = {};
        this.loadSettings();
    }
    loadSettings() {
        try {
            if (fs_1.default.existsSync(this.settingsPath)) {
                const data = fs_1.default.readFileSync(this.settingsPath, 'utf-8');
                this.settings = JSON.parse(data);
            }
            else {
                this.settings = {};
                this.saveSettings();
            }
        }
        catch (error) {
            console.error('Error loading settings:', error);
            this.settings = {};
        }
    }
    saveSettings() {
        try {
            fs_1.default.writeFileSync(this.settingsPath, JSON.stringify(this.settings, null, 2));
        }
        catch (error) {
            console.error('Error saving settings:', error);
            throw error;
        }
    }
    get(key, defaultValue = null) {
        const value = this.settings[key];
        return value || defaultValue;
    }
    set(key, value) {
        this.settings[key] = value;
        this.saveSettings();
    }
    // Helper method to check if settings exist
    has(key) {
        return key in this.settings;
    }
    // Helper method to delete a setting
    delete(key) {
        delete this.settings[key];
        this.saveSettings();
    }
}
// Export a singleton instance
exports.settingsStore = new SettingsStore();
