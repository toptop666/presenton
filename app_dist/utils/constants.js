"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logsDir = exports.userConfigPath = exports.downloadsDir = exports.userDataDir = exports.tempDir = exports.nextjsDir = exports.fastapiDir = exports.baseDir = exports.isDev = exports.localhost = void 0;
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
exports.localhost = "http://127.0.0.1";
exports.isDev = !electron_1.app.isPackaged;
exports.baseDir = electron_1.app.getAppPath();
exports.fastapiDir = exports.isDev ? path_1.default.join(exports.baseDir, "servers/fastapi") : path_1.default.join(exports.baseDir, "resources/fastapi");
exports.nextjsDir = exports.isDev ? path_1.default.join(exports.baseDir, "servers/nextjs") : path_1.default.join(exports.baseDir, "resources/nextjs");
exports.tempDir = path_1.default.join(electron_1.app.getPath("temp"), "presenton");
exports.userDataDir = electron_1.app.getPath("userData");
exports.downloadsDir = electron_1.app.getPath("downloads");
exports.userConfigPath = path_1.default.join(exports.userDataDir, "userConfig.json");
exports.logsDir = path_1.default.join(exports.userDataDir, "logs");
