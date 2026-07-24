import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import { DatabaseService } from '../../../database/DatabaseService';
import { LibraryMutationService } from '../LibraryMutationService';
import { runMigrations } from '../../../database/migrations';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

describe('LibraryMutationService', () => {
  let dbService: DatabaseService;
  let mutationService: LibraryMutationService;
  let testDbPath: string;

  let dbInstance: Database.Database;

  beforeEach(() => {
    testDbPath = path.join(os.tmpdir(), `gliv_test_${Date.now()}.sqlite`);
    dbInstance = new Database(testDbPath);
    runMigrations(dbInstance);

    dbService = new DatabaseService();
    dbService.getDb = () => dbInstance;
    
    mutationService = new LibraryMutationService(dbService);

    // Seed data
    dbInstance.prepare(`INSERT INTO titles (id, original_order, rating, favorite) VALUES (1, 1, 8.5, 0)`).run();
    dbInstance.prepare(`INSERT INTO formats (id, title_id, media_type, progress_unit, personal_progress, status) VALUES (10, 1, 'Manga', 'Chapter', 10, 'Reading')`).run();
  });

  afterEach(() => {
    try { dbInstance.close(); } catch(e) {}
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  it('edits progress and logs edit_history', () => {
    mutationService.editProgress(10, 15);
    const db = dbService.getDb();
    const format = db.prepare(`SELECT personal_progress FROM formats WHERE id = 10`).get() as any;
    expect(format.personal_progress).toBe(15);

    const history = db.prepare(`SELECT * FROM edit_history WHERE entity_type = 'FORMAT' AND entity_id = 10 AND field = 'personal_progress'`).get() as any;
    expect(history.old_value).toBe('10');
    expect(history.new_value).toBe('15');
  });

  it('validates rating 1.0 - 10.0 in 0.5 increments', () => {
    expect(() => mutationService.editRating(1, 11)).toThrow('Rating must be between 1.0 and 10.0');
    expect(() => mutationService.editRating(1, 0)).toThrow('Rating must be between 1.0 and 10.0');
    expect(() => mutationService.editRating(1, 7.3)).toThrow('Rating must be between 1.0 and 10.0');
    
    mutationService.editRating(1, 9.5);
    const db = dbService.getDb();
    const title = db.prepare(`SELECT rating FROM titles WHERE id = 1`).get() as any;
    expect(title.rating).toBe(9.5);
    
    const history = db.prepare(`SELECT * FROM edit_history WHERE entity_type = 'TITLE' AND entity_id = 1 AND field = 'rating'`).get() as any;
    expect(history.old_value).toBe('8.5');
    expect(history.new_value).toBe('9.5');
  });

  it('toggles favorite', () => {
    mutationService.toggleFavorite(1);
    const db = dbService.getDb();
    const title = db.prepare(`SELECT favorite FROM titles WHERE id = 1`).get() as any;
    expect(title.favorite).toBe(1);
  });

  it('edits notes', () => {
    mutationService.editNotes(1, 'Great start!');
    const db = dbService.getDb();
    const notes = db.prepare(`SELECT content FROM notes WHERE title_id = 1`).get() as any;
    expect(notes.content).toBe('Great start!');
  });
});
