import { contextBridge, ipcRenderer } from 'electron';

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Database API scaffold (to be expanded in later modules)
  pingDatabase: () => ipcRenderer.invoke('db:ping'),
});
