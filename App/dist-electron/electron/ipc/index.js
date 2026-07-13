"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupIpcHandlers = setupIpcHandlers;
const electron_1 = require("electron");
function setupIpcHandlers(dbService) {
    electron_1.ipcMain.handle('db:ping', () => {
        // Simple ping to verify connection layer is up
        return dbService.isReady();
    });
}
