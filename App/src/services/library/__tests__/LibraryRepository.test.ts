import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import { DatabaseService } from '../../../database/DatabaseService';
import { LibraryRepository } from '../LibraryRepository';
import { runMigrations } from '../../../database/migrations';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

describe('LibraryRepository', () => {
  let dbService: DatabaseService;
  let repository: LibraryRepository;
  let testDbPath: string;

  let dbInstance: Database.Database;

  beforeEach(() => {
    testDbPath = path.join(os.tmpdir(), `gliv_test_repo_${Date.now()}.sqlite`);
    dbInstance = new Database(testDbPath);
    runMigrations(dbInstance);
    
    // Seed test data
    dbInstance.prepare(`INSERT INTO titles (id, original_order, rating, favorite) VALUES (1, 1, 9.0, 1)`).run();
    dbInstance.prepare(`INSERT INTO alternative_titles (title_id, alt_title) VALUES (1, 'Alpha Title')`).run();
    dbInstance.prepare(`INSERT INTO formats (id, title_id, media_type, progress_unit, personal_progress, status) VALUES (10, 1, 'Anime', 'Episode', 5, 'Watching')`).run();

    dbInstance.prepare(`INSERT INTO titles (id, original_order, rating, favorite) VALUES (2, 2, 8.0, 0)`).run();
    dbInstance.prepare(`INSERT INTO alternative_titles (title_id, alt_title) VALUES (2, 'Beta Title')`).run();
    dbInstance.prepare(`INSERT INTO formats (id, title_id, media_type, progress_unit, personal_progress, status) VALUES (11, 2, 'Manga', 'Chapter', 10, 'Reading')`).run();
    dbInstance.prepare(`INSERT INTO formats (id, title_id, media_type, progress_unit, personal_progress, status) VALUES (12, 2, 'Anime', 'Episode', 12, 'Completed')`).run();

    dbService = new DatabaseService();
    dbService.getDb = () => dbInstance;
    repository = new LibraryRepository(dbService);
  });

  afterEach(() => {
    try { dbInstance.close(); } catch(e) {}
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  it('sorts by Original Order', () => {
    const results = repository.getLibrary('Original Order', {});
    expect(results.length).toBe(2);
    expect(results[0].id).toBe(1);
    expect(results[1].id).toBe(2);
  });

  it('sorts by Alphabetical', () => {
    const results = repository.getLibrary('Alphabetical', {});
    expect(results[0].displayTitle).toBe('Alpha Title');
    expect(results[1].displayTitle).toBe('Beta Title');
  });

  it('sorts by Personal Rating', () => {
    const results = repository.getLibrary('Personal Rating', {});
    // 9.0 vs 8.0
    expect(results[0].id).toBe(1);
    expect(results[1].id).toBe(2);
  });

  it('filters by Any Match Status', () => {
    // Title 2 has both 'Reading' and 'Completed' formats
    const results = repository.getLibrary('Original Order', { status: 'Completed' });
    expect(results.length).toBe(1);
    expect(results[0].id).toBe(2);

    const readingResults = repository.getLibrary('Original Order', { status: 'Reading' });
    expect(readingResults.length).toBe(1);
    expect(readingResults[0].id).toBe(2);
  });

  it('filters by Favorites', () => {
    const results = repository.getLibrary('Original Order', { favoritesOnly: true });
    expect(results.length).toBe(1);
    expect(results[0].id).toBe(1);
  });

  it('searches locally by alt_title', () => {
    const results = repository.getLibrary('Original Order', {}, 'Beta');
    expect(results.length).toBe(1);
    expect(results[0].id).toBe(2);
  });
});
