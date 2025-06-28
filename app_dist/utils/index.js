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
exports.setUserConfig = setUserConfig;
exports.getUserConfig = getUserConfig;
exports.setupEnv = setupEnv;
exports.killProcess = killProcess;
exports.findUnusedPorts = findUnusedPorts;
exports.sanitizeFilename = sanitizeFilename;
const net_1 = __importDefault(require("net"));
const tree_kill_1 = __importDefault(require("tree-kill"));
const fs_1 = __importDefault(require("fs"));
const constants_1 = require("./constants");
function setUserConfig(userConfig) {
    let existingConfig = {};
    if (fs_1.default.existsSync(constants_1.userConfigPath)) {
        const configData = fs_1.default.readFileSync(constants_1.userConfigPath, 'utf-8');
        existingConfig = JSON.parse(configData);
    }
    const mergedConfig = {
        LLM: userConfig.LLM || existingConfig.LLM,
        OPENAI_API_KEY: userConfig.OPENAI_API_KEY || existingConfig.OPENAI_API_KEY,
        GOOGLE_API_KEY: userConfig.GOOGLE_API_KEY || existingConfig.GOOGLE_API_KEY
    };
    fs_1.default.writeFileSync(constants_1.userConfigPath, JSON.stringify(mergedConfig));
}
function getUserConfig() {
    if (!fs_1.default.existsSync(constants_1.userConfigPath)) {
        return {};
    }
    const configData = fs_1.default.readFileSync(constants_1.userConfigPath, 'utf-8');
    return JSON.parse(configData);
}
function setupEnv(fastApiPort, nextjsPort) {
    process.env.NEXT_PUBLIC_FAST_API = `${constants_1.localhost}:${fastApiPort}`;
    process.env.TEMP_DIRECTORY = constants_1.tempDir;
    process.env.NEXT_PUBLIC_USER_CONFIG_PATH = constants_1.userConfigPath;
    process.env.NEXT_PUBLIC_URL = `${constants_1.localhost}:${nextjsPort}`;
}
function killProcess(pid) {
    return new Promise((resolve, reject) => {
        (0, tree_kill_1.default)(pid, "SIGTERM", (err) => {
            if (err) {
                console.error(`Error killing process ${pid}:`, err);
                reject(err);
            }
            else {
                console.log(`Process ${pid} killed`);
                resolve(true);
            }
        });
    });
}
function findUnusedPorts() {
    return __awaiter(this, arguments, void 0, function* (startPort = 40000, count = 2) {
        const ports = [];
        console.log(`Finding ${count} unused ports starting from ${startPort}`);
        const isPortAvailable = (port) => {
            return new Promise((resolve) => {
                const server = net_1.default.createServer();
                server.once('error', () => {
                    resolve(false);
                });
                server.once('listening', () => {
                    server.close();
                    resolve(true);
                });
                server.listen(port);
            });
        };
        let currentPort = startPort;
        while (ports.length < count) {
            if (yield isPortAvailable(currentPort)) {
                ports.push(currentPort);
            }
            currentPort++;
        }
        return ports;
    });
}
function sanitizeFilename(filename) {
    return filename.replace(/[\\/:*?"<>|]/g, '_');
}
