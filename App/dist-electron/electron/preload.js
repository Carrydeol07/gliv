"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose safe APIs to the renderer process
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    // Database API scaffold (to be expanded in later modules)
    pingDatabase: () => electron_1.ipcRenderer.invoke('db:ping'),
});
