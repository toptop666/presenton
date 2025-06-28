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
exports.startFastApiServer = startFastApiServer;
exports.startNextJsServer = startNextJsServer;
const child_process_1 = require("child_process");
const constants_1 = require("./constants");
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
// @ts-ignore
const serve_handler_1 = __importDefault(require("serve-handler"));
const path_1 = __importDefault(require("path"));
function startFastApiServer(directory, port, env, isDev) {
    return __awaiter(this, void 0, void 0, function* () {
        // Start FastAPI server
        const startCommand = isDev ? [
            ".venv/bin/python",
            ["server_autoreload.py", "--port", port.toString()],
        ] : [
            "./fastapi", ["--port", port.toString()],
        ];
        const fastApiProcess = (0, child_process_1.spawn)(startCommand[0], startCommand[1], {
            cwd: directory,
            stdio: ["inherit", "pipe", "pipe"],
            env: Object.assign(Object.assign({}, process.env), env),
        });
        fastApiProcess.stdout.on("data", (data) => {
            fs_1.default.appendFileSync(path_1.default.join(constants_1.logsDir, "fastapi-server.log"), data);
            console.log(`FastAPI: ${data}`);
        });
        fastApiProcess.stderr.on("data", (data) => {
            fs_1.default.appendFileSync(path_1.default.join(constants_1.logsDir, "fastapi-server.log"), data);
            console.error(`FastAPI: ${data}`);
        });
        // Wait for FastAPI server to start
        yield waitForServer(`${constants_1.localhost}:${port}/docs`);
        return fastApiProcess;
    });
}
function startNextJsServer(directory, port, env, isDev) {
    return __awaiter(this, void 0, void 0, function* () {
        let nextjsProcess;
        if (isDev) {
            // Start NextJS development server
            nextjsProcess = (0, child_process_1.spawn)("npm", ["run", "dev", "--", "-p", port.toString()], {
                cwd: directory,
                stdio: ["inherit", "pipe", "pipe"],
                env: Object.assign(Object.assign({}, process.env), env),
            });
            nextjsProcess.stdout.on("data", (data) => {
                fs_1.default.appendFileSync(path_1.default.join(constants_1.logsDir, "nextjs-server.log"), data);
                console.log(`NextJS: ${data}`);
            });
            nextjsProcess.stderr.on("data", (data) => {
                fs_1.default.appendFileSync(path_1.default.join(constants_1.logsDir, "nextjs-server.log"), data);
                console.error(`NextJS: ${data}`);
            });
        }
        else {
            // Start NextJS build server
            nextjsProcess = startNextjsBuildServer(directory, port);
        }
        // Wait for NextJS server to start
        yield waitForServer(`${constants_1.localhost}:${port}`);
        return nextjsProcess;
    });
}
function startNextjsBuildServer(directory, port) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = http_1.default.createServer((req, res) => {
            return (0, serve_handler_1.default)(req, res, {
                public: directory,
                cleanUrls: true,
            });
        });
        server.listen(port);
        return server;
    });
}
function waitForServer(url_1) {
    return __awaiter(this, arguments, void 0, function* (url, timeout = 30000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            try {
                yield new Promise((resolve, reject) => {
                    http_1.default.get(url, (res) => {
                        if (res.statusCode === 200 || res.statusCode === 304) {
                            resolve();
                        }
                        else {
                            reject(new Error(`Unexpected status code: ${res.statusCode}`));
                        }
                    }).on('error', reject);
                });
                return;
            }
            catch (error) {
                yield new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        throw new Error(`Server did not start within ${timeout}ms`);
    });
}
