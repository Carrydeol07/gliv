import Database from 'better-sqlite3';
import * as path from 'path';
import { app } from 'electron';
import { runMigrations } from './migrations';

export class DatabaseService {
  private db: Database.Database | null = null;
  private isInitialized: boolean = false;

  public initialize(): void {
    if (this.isInitialized) return;

    try {
      // Create/open the sqlite database in the userData directory per specification
      const dbPath = path.join(app.getPath('userData'), 'gliv.sqlite');
      this.db = new Database(dbPath, {
        // Enable WAL mode for better performance
      });

      this.db.pragma('journal_mode = WAL');
      this.db.pragma('foreign_keys = ON');

      // Run migrations (currently an empty scaffold)
      runMigrations(this.db);

      this.isInitialized = true;
      console.log(`Database initialized at: ${dbPath}`);
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  public isReady(): boolean {
    return this.isInitialized && this.db !== null && this.db.open;
  }

  public close(): void {
    if (this.db) {
      this.db.close();
      this.isInitialized = false;
    }
  }

  /**
   * Returns the underlying better-sqlite3 database instance.
   * Required by services (like ProviderManager) for write operations.
   */
  public getDb(): Database.Database {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  // Future methods for Phase 2 will go here
}
