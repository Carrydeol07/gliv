import { DatabaseService } from '../../database/DatabaseService';

export class StartupCleanup {
  /**
   * Deletes all orphaned cache entries older than 7 days.
   */
  public static run(dbService: DatabaseService): void {
    const db = dbService.getDb();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    
    try {
      db.prepare('DELETE FROM cache_entries WHERE orphaned_at < ?').run(sevenDaysAgo);
    } catch (error) {
      console.error('Failed to cleanup orphaned cache entries', error);
    }
  }
}
