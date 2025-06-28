"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupLogHandler = setupLogHandler;
const electron_1 = require("electron");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const constants_1 = require("../utils/constants");
function setupLogHandler() {
    // Ensure logs directory exists
    const logsDir = path.join(constants_1.userDataDir, 'logs');
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }
    const logFilePath = path.join(logsDir, 'nextjs.log');
    // Handle log writing through IPC - non-blocking
    electron_1.ipcMain.handle('write-nextjs-log', (_, logData) => {
        try {
            const timestamp = new Date().toISOString();
            const logEntry = `[${timestamp}] ${logData}\n`;
            // Use non-blocking write
            fs.appendFile(logFilePath, logEntry, (err) => {
                if (err) {
                    console.error('Error writing to log file:', err);
                }
            });
            return { success: true };
        }
        catch (error) {
            console.error('Error in log handler:', error);
            return { success: false, error: error.message };
        }
    });
    // Handle log clearing
    electron_1.ipcMain.handle('clear-nextjs-logs', () => {
        try {
            // Create a new empty file, effectively clearing the old one
            fs.writeFile(logFilePath, '', (err) => {
                if (err) {
                    console.error('Error clearing log file:', err);
                }
            });
            return { success: true };
        }
        catch (error) {
            console.error('Error in clear logs handler:', error);
            return { success: false, error: error.message };
        }
    });
}
