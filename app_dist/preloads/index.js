"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('env', {
    NEXT_PUBLIC_FAST_API: process.env.NEXT_PUBLIC_FAST_API || '',
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || '',
    TEMP_DIRECTORY: process.env.TEMP_DIRECTORY || '',
    NEXT_PUBLIC_USER_CONFIG_PATH: process.env.NEXT_PUBLIC_USER_CONFIG_PATH || '',
});
electron_1.contextBridge.exposeInMainWorld('electron', {
    fileDownloaded: (filePath) => electron_1.ipcRenderer.invoke("file-downloaded", filePath),
    exportAsPDF: (id, title) => electron_1.ipcRenderer.invoke("export-as-pdf", id, title),
    getUserConfig: () => electron_1.ipcRenderer.invoke("get-user-config"),
    setUserConfig: (userConfig) => electron_1.ipcRenderer.invoke("set-user-config", userConfig),
    readFile: (filePath) => electron_1.ipcRenderer.invoke("read-file", filePath),
    getSlideMetadata: (url, theme, customColors, tempDirectory) => electron_1.ipcRenderer.invoke("get-slide-metadata", url, theme, customColors, tempDirectory),
    getFooter: (userId) => electron_1.ipcRenderer.invoke("get-footer", userId),
    setFooter: (userId, properties) => electron_1.ipcRenderer.invoke("set-footer", userId, properties),
    getTheme: (userId) => electron_1.ipcRenderer.invoke("get-theme", userId),
    setTheme: (userId, themeData) => electron_1.ipcRenderer.invoke("set-theme", userId, themeData),
    uploadImage: (file) => electron_1.ipcRenderer.invoke("upload-image", file),
    writeNextjsLog: (logData) => electron_1.ipcRenderer.invoke("write-nextjs-log", logData),
    clearNextjsLogs: () => electron_1.ipcRenderer.invoke("clear-nextjs-logs"),
});
