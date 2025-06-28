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
require("dotenv").config();
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
const servers_1 = require("./utils/servers");
const constants_1 = require("./utils/constants");
const ipc_1 = require("./ipc");
var win;
var fastApiProcess;
var nextjsProcess;
electron_1.app.commandLine.appendSwitch('gtk-version', '3');
const createWindow = () => {
    win = new electron_1.BrowserWindow({
        width: 1280,
        height: 720,
        icon: path_1.default.join(constants_1.baseDir, "resources/ui/assets/images/presenton_short_filled.png"),
        webPreferences: {
            webSecurity: false,
            preload: path_1.default.join(__dirname, 'preloads/index.js'),
        },
    });
};
function startServers(fastApiPort, nextjsPort) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            fastApiProcess = yield (0, servers_1.startFastApiServer)(constants_1.fastapiDir, fastApiPort, {
                DEBUG: constants_1.isDev ? "True" : "False",
                LLM: process.env.LLM,
                OPENAI_API_KEY: process.env.OPENAI_API_KEY,
                GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
                APP_DATA_DIRECTORY: constants_1.userDataDir,
                TEMP_DIRECTORY: constants_1.tempDir,
                USER_CONFIG_PATH: constants_1.userConfigPath,
            }, constants_1.isDev);
            nextjsProcess = yield (0, servers_1.startNextJsServer)(constants_1.nextjsDir, nextjsPort, {
                NEXT_PUBLIC_FAST_API: process.env.NEXT_PUBLIC_FAST_API,
                TEMP_DIRECTORY: process.env.TEMP_DIRECTORY,
                NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
                NEXT_PUBLIC_USER_CONFIG_PATH: process.env.NEXT_PUBLIC_USER_CONFIG_PATH,
            }, constants_1.isDev);
        }
        catch (error) {
            console.error("Server startup error:", error);
        }
    });
}
function stopServers() {
    return __awaiter(this, void 0, void 0, function* () {
        if (fastApiProcess === null || fastApiProcess === void 0 ? void 0 : fastApiProcess.pid) {
            yield (0, utils_1.killProcess)(fastApiProcess.pid);
        }
        if (nextjsProcess) {
            if (constants_1.isDev) {
                yield (0, utils_1.killProcess)(nextjsProcess.pid);
            }
            else {
                nextjsProcess.close();
            }
        }
    });
}
electron_1.app.whenReady().then(() => __awaiter(void 0, void 0, void 0, function* () {
    createWindow();
    win === null || win === void 0 ? void 0 : win.loadFile(path_1.default.join(constants_1.baseDir, "resources/ui/homepage/index.html"));
    (0, utils_1.setUserConfig)({
        LLM: process.env.LLM,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    });
    const [fastApiPort, nextjsPort] = yield (0, utils_1.findUnusedPorts)();
    console.log(`FastAPI port: ${fastApiPort}, NextJS port: ${nextjsPort}`);
    //? Setup environment variables to be used in the preloads
    (0, utils_1.setupEnv)(fastApiPort, nextjsPort);
    (0, ipc_1.setupIpcHandlers)();
    yield startServers(fastApiPort, nextjsPort);
    win === null || win === void 0 ? void 0 : win.loadURL(`${constants_1.localhost}:${nextjsPort}`);
}));
electron_1.app.on("window-all-closed", () => __awaiter(void 0, void 0, void 0, function* () {
    yield stopServers();
    electron_1.app.quit();
}));
