"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupIpcHandlers = setupIpcHandlers;
const export_handlers_1 = require("./export_handlers");
const user_config_handlers_1 = require("./user_config_handlers");
const slide_metadata_1 = require("./slide_metadata");
const read_file_1 = require("./read_file");
const footer_handlers_1 = require("./footer_handlers");
const theme_handlers_1 = require("./theme_handlers");
const upload_image_1 = require("./upload_image");
const log_handler_1 = require("./log_handler");
function setupIpcHandlers() {
    (0, export_handlers_1.setupExportHandlers)();
    (0, user_config_handlers_1.setupUserConfigHandlers)();
    (0, slide_metadata_1.setupSlideMetadataHandlers)();
    (0, read_file_1.setupReadFile)();
    (0, footer_handlers_1.setupFooterHandlers)();
    (0, theme_handlers_1.setupThemeHandlers)();
    (0, upload_image_1.setupUploadImage)();
    (0, log_handler_1.setupLogHandler)();
}
