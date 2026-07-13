import { ipcMain } from 'electron';
import { DatabaseService } from '../../src/database/DatabaseService';

export function setupIpcHandlers(dbService: DatabaseService) {
  ipcMain.handle('db:ping', () => {
    // Simple ping to verify connection layer is up
    return dbService.isReady();
  });
}
