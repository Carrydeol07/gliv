import { DatabaseService } from '../../../database/DatabaseService';
import { ImportEngine } from '../ImportEngine';
import { ImportReviewAction } from '../types';
import { NormalizedSearchResult, ProviderId, MediaType } from '../../../models/provider.types';
import Database from 'better-sqlite3';
import { migration } from '../../../database/migrations/001_initial_schema';

// Setup and teardown for the DatabaseService to use an in-memory SQLite for testing
let dbService: DatabaseService;
let engine: ImportEngine;
let db: Database.Database;

beforeEach(() => {
  dbService = new DatabaseService();
  // Override initialize to use in-memory db
  dbService.initialize = function() {
    this.isInitialized = true;
    this.db = new Database(':memory:');
    this.db.pragma('foreign_keys = ON');
    
    // We need to run migrations to set up the schema.
    this.db.exec(migration.up);
  };


  
  dbService.initialize();
  db = dbService.getDb();
  engine = new ImportEngine(dbService);
});

afterEach(() => {
  dbService.close();
});

const mockImportedData: NormalizedSearchResult = {
  title: 'Test Anime',
  alternativeTitles: ['Alt Test Anime'],
  formats: [MediaType.ANIME],
  poster: null,
  synopsis: null,
  contributors: [],
  genres: [],
  publicationInfo: null,
  availability: null,
  providerReferences: [{ providerId: ProviderId.ANILIST, providerEntityId: '123' }]
};

describe('ImportEngine', () => {
  
  it('Deterministic match bypasses Import Review and never creates a duplicate row', async () => {
    // Setup existing AUTO match
    db.prepare(`INSERT INTO titles (original_order) VALUES (1)`).run();
    db.prepare(`INSERT INTO formats (title_id, media_type, progress_unit, status) VALUES (1, 'Anime', 'Episode', 'Reading')`).run();
    db.prepare(`INSERT INTO external_references (format_id, provider_id, provider_entity_id, confidence, verification_state, last_verified)
                VALUES (1, 'anilist', '123', 1.0, 'AUTO', '2020-01-01 00:00:00')`).run();

    const candidate = await engine.processSearchImport(mockImportedData);
    
    // Should return null to signal bypass
    expect(candidate).toBeNull();
    
    // last_verified should be updated, and only 1 row should exist
    const ref = db.prepare(`SELECT last_verified FROM external_references WHERE provider_entity_id = '123'`).get() as { last_verified: string };
    expect(ref.last_verified).not.toBe('2020-01-01 00:00:00');
    
    const count = db.prepare(`SELECT COUNT(*) as c FROM external_references WHERE provider_entity_id = '123'`).get() as { c: number };
    expect(count.c).toBe(1);
  });

  it('A second PENDING candidate for the same Format + provider is never created; the existing one is reused', async () => {
    // Setup existing PENDING match
    db.prepare(`INSERT INTO titles (original_order) VALUES (1)`).run();
    db.prepare(`INSERT INTO formats (title_id, media_type, progress_unit, status) VALUES (1, 'Anime', 'Episode', 'Reading')`).run();
    db.prepare(`INSERT INTO external_references (format_id, provider_id, provider_entity_id, confidence, verification_state, last_verified)
                VALUES (1, 'anilist', '123', 0.5, 'PENDING', '2020-01-01 00:00:00')`).run();

    const candidate = await engine.processSearchImport(mockImportedData);
    
    // Should return a candidate and not null
    expect(candidate).not.toBeNull();
    expect(candidate!.suggestedProviderMatch?.confidence).toBe(1.0); // Updated confidence
    
    // last_verified should NOT be updated
    const ref = db.prepare(`SELECT last_verified FROM external_references WHERE provider_entity_id = '123'`).get() as { last_verified: string };
    expect(ref.last_verified).toBe('2020-01-01 00:00:00');
    
    const count = db.prepare(`SELECT COUNT(*) as c FROM external_references WHERE provider_entity_id = '123'`).get() as { c: number };
    expect(count.c).toBe(1);
  });

  it('Merge preserves Personal Progress from existing Library entry', async () => {
    // Setup existing title and format
    db.prepare(`INSERT INTO titles (original_order) VALUES (1)`).run();
    db.prepare(`INSERT INTO formats (title_id, media_type, progress_unit, personal_progress, status) 
                VALUES (1, 'Anime', 'Episode', 42, 'Watching')`).run();

    const candidate = await engine.processSearchImport(mockImportedData);
    
    await engine.commitAction({
      candidate: candidate!,
      action: ImportReviewAction.MERGE,
      targetTitleId: 1
    });

    const format = db.prepare(`SELECT personal_progress, status FROM formats WHERE title_id = 1`).get() as any;
    expect(format.personal_progress).toBe(42);
    expect(format.status).toBe('Watching');
  });

  it('Create Manual Title produces a Format with no external_reference', async () => {
    const candidate = await engine.processSearchImport(mockImportedData);
    
    await engine.commitAction({
      candidate: candidate!,
      action: ImportReviewAction.CREATE_MANUAL_TITLE
    });

    // Check titles count
    const titleCount = db.prepare(`SELECT COUNT(*) as c FROM titles`).get() as { c: number };
    expect(titleCount.c).toBe(1);

    // Check format count
    const formatCount = db.prepare(`SELECT COUNT(*) as c FROM formats`).get() as { c: number };
    expect(formatCount.c).toBe(1);

    // Check external_references count
    const refCount = db.prepare(`SELECT COUNT(*) as c FROM external_references`).get() as { c: number };
    expect(refCount.c).toBe(0);
  });

  it('Replacing a confirmed external_reference auto-removes any Progress Override and logs it to Edit History', async () => {
    // Setup existing title and format with a progress override and an old reference
    db.prepare(`INSERT INTO titles (original_order) VALUES (1)`).run();
    db.prepare(`INSERT INTO formats (title_id, media_type, progress_unit, status, progress_override) 
                VALUES (1, 'Anime', 'Episode', 'Reading', 99)`).run();
    db.prepare(`INSERT INTO external_references (format_id, provider_id, provider_entity_id, confidence, verification_state)
                VALUES (1, 'anilist', 'old_999', 1.0, 'USER_CONFIRMED')`).run();

    const candidate = await engine.processSearchImport(mockImportedData);
    
    await engine.commitAction({
      candidate: candidate!,
      action: ImportReviewAction.MERGE,
      targetTitleId: 1
    });

    const format = db.prepare(`SELECT progress_override FROM formats WHERE title_id = 1`).get() as { progress_override: number | null };
    expect(format.progress_override).toBeNull();

    const history = db.prepare(`SELECT * FROM edit_history WHERE entity_type = 'FORMAT'`).get() as any;
    expect(history).not.toBeUndefined();
    expect(history.field).toBe('Progress Override Removed (Provider Reference Changed)');
    expect(history.old_value).toBe('99');
    expect(history.new_value).toBeNull();
  });

  it('USER_REJECTED mappings are never retried automatically', async () => {
    // Setup existing USER_REJECTED match
    db.prepare(`INSERT INTO titles (original_order) VALUES (1)`).run();
    db.prepare(`INSERT INTO formats (title_id, media_type, progress_unit, status) VALUES (1, 'Anime', 'Episode', 'Reading')`).run();
    db.prepare(`INSERT INTO external_references (format_id, provider_id, provider_entity_id, confidence, verification_state)
                VALUES (1, 'anilist', '123', 1.0, 'USER_REJECTED')`).run();

    const candidate = await engine.processSearchImport(mockImportedData);
    
    // Should return null because it's rejected
    expect(candidate).toBeNull();
  });

  it('Add Another Format skips Library Duplicate Matching but still runs Provider Identity Matching', async () => {
    const candidate = await engine.processAddAnotherFormat(mockImportedData, 999);
    
    expect(candidate).not.toBeNull();
    expect(candidate!.existingLibraryMatch).toEqual({ titleId: 999, confidence: 1.0 });
    expect(candidate!.suggestedAction).toBe(ImportReviewAction.MERGE);
  });
});
