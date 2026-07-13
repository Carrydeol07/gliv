import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import { runMigrations } from '../migrations';

/** Helper: insert a title and return its id */
function insertTitle(db: Database.Database, order: number = 1): number {
  const result = db.prepare('INSERT INTO titles (original_order) VALUES (?)').run(order);
  return Number(result.lastInsertRowid);
}

/** Helper: insert a format and return its id */
function insertFormat(
  db: Database.Database,
  titleId: number,
  mediaType: string = 'Anime',
  progressUnit: string = 'Episode',
  status: string = 'Watching'
): number {
  const result = db.prepare(`
    INSERT INTO formats (title_id, media_type, progress_unit, status) 
    VALUES (?, ?, ?, ?)
  `).run(titleId, mediaType, progressUnit, status);
  return Number(result.lastInsertRowid);
}

describe('Database Schema (Module 02)', () => {
  let db: Database.Database;

  beforeEach(() => {
    // In-memory database for testing
    db = new Database(':memory:');
    runMigrations(db);
  });

  afterEach(() => {
    db.close();
  });

  it('runs migrations cleanly on an empty database', () => {
    const tableInfo = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as { name: string }[];
    const tables = tableInfo.map(t => t.name);
    
    expect(tables).toContain('titles');
    expect(tables).toContain('formats');
    expect(tables).toContain('providers');
    expect(tables).toContain('edit_history');
    expect(tables).toContain('collections');
  });

  it('seeds exactly 3 providers and excludes Comick', () => {
    const providers = db.prepare('SELECT id FROM providers').all() as { id: string }[];
    const providerIds = providers.map(p => p.id);
    
    expect(providerIds).toHaveLength(3);
    expect(providerIds).toContain('anilist');
    expect(providerIds).toContain('jikan');
    expect(providerIds).toContain('mangaupdates');
    expect(providerIds).not.toContain('comick');
  });

  it('titles table includes original_order, rating, and favorite columns', () => {
    const titleId = insertTitle(db, 1);

    // Update rating and favorite
    db.prepare('UPDATE titles SET rating = 8.5, favorite = 1 WHERE id = ?').run(titleId);

    const row = db.prepare('SELECT original_order, rating, favorite FROM titles WHERE id = ?').get(titleId) as any;
    expect(row.original_order).toBe(1);
    expect(row.rating).toBe(8.5);
    expect(row.favorite).toBe(1);
  });

  it('formats table includes media_type column with CHECK constraint', () => {
    const titleId = insertTitle(db);
    
    // Valid media type works
    expect(() => insertFormat(db, titleId, 'Manga', 'Chapter', 'Reading')).not.toThrow();

    // Invalid media type is rejected
    expect(() => {
      db.prepare(`
        INSERT INTO formats (title_id, media_type, progress_unit, status) 
        VALUES (?, 'Comic', 'Chapter', 'Reading')
      `).run(titleId);
    }).toThrow(/CHECK constraint failed/);
  });

  it('enforces UNIQUE(title_id, media_type) — one Format per media type per Title', () => {
    const titleId = insertTitle(db);
    insertFormat(db, titleId, 'Anime', 'Episode', 'Watching');

    // Second Anime format for same title is rejected
    expect(() => {
      insertFormat(db, titleId, 'Anime', 'Episode', 'Watching');
    }).toThrow(/UNIQUE constraint failed/);

    // Different media type for same title is allowed
    expect(() => {
      insertFormat(db, titleId, 'Manga', 'Chapter', 'Reading');
    }).not.toThrow();
  });

  it('enforces formats.progress_unit immutability via trigger', () => {
    const titleId = insertTitle(db);
    const formatId = insertFormat(db, titleId, 'Anime', 'Episode', 'Watching');

    // Allowed: Update a different column (e.g., personal_progress)
    expect(() => {
      db.prepare('UPDATE formats SET personal_progress = 10 WHERE id = ?').run(formatId);
    }).not.toThrow();

    // Blocked: Try to change progress_unit
    expect(() => {
      db.prepare('UPDATE formats SET progress_unit = ? WHERE id = ?').run('Chapter', formatId);
    }).toThrow('progress_unit is immutable');
  });

  it('enforces external_references unique constraint on (format_id, provider_id)', () => {
    const titleId = insertTitle(db);
    const formatId = insertFormat(db, titleId);

    // Insert first reference
    db.prepare(`
      INSERT INTO external_references (format_id, provider_id, provider_entity_id, verification_state)
      VALUES (?, 'anilist', '123', 'AUTO')
    `).run(formatId);

    // Try to insert a second reference for the same format and provider
    expect(() => {
      db.prepare(`
        INSERT INTO external_references (format_id, provider_id, provider_entity_id, verification_state)
        VALUES (?, 'anilist', '456', 'PENDING')
      `).run(formatId);
    }).toThrow(/UNIQUE constraint failed/);
  });

  it('enforces publication_info one-to-one unique constraint', () => {
    const titleId = insertTitle(db);
    const formatId = insertFormat(db, titleId);

    db.prepare('INSERT INTO publication_info (format_id) VALUES (?)').run(formatId);

    expect(() => {
      db.prepare('INSERT INTO publication_info (format_id) VALUES (?)').run(formatId);
    }).toThrow(/UNIQUE constraint failed/);
  });

  it('enforces metadata one-to-one unique constraint', () => {
    const titleId = insertTitle(db);

    db.prepare('INSERT INTO metadata (title_id) VALUES (?)').run(titleId);

    expect(() => {
      db.prepare('INSERT INTO metadata (title_id) VALUES (?)').run(titleId);
    }).toThrow(/UNIQUE constraint failed/);
  });

  it('blocks orphaned inserts via foreign keys', () => {
    // Foreign keys must be enabled in sqlite
    db.pragma('foreign_keys = ON');

    expect(() => {
      db.prepare(`
        INSERT INTO formats (title_id, media_type, progress_unit, status) 
        VALUES (999, 'Anime', 'Episode', 'Watching')
      `).run();
    }).toThrow(/FOREIGN KEY constraint failed/);
  });

  it('edit_history includes source column with CHECK constraint', () => {
    const titleId = insertTitle(db);

    // USER source works
    db.prepare(`
      INSERT INTO edit_history (entity_type, entity_id, field, old_value, new_value, source)
      VALUES ('titles', ?, 'rating', NULL, '8.5', 'USER')
    `).run(titleId);

    // PROVIDER_SYNC source works
    db.prepare(`
      INSERT INTO edit_history (entity_type, entity_id, field, old_value, new_value, source)
      VALUES ('formats', ?, 'progress_override', '50', NULL, 'PROVIDER_SYNC')
    `).run(titleId);

    // Default is USER
    db.prepare(`
      INSERT INTO edit_history (entity_type, entity_id, field, old_value, new_value)
      VALUES ('titles', ?, 'rating', '8.5', '9.0')
    `).run(titleId);
    const row = db.prepare('SELECT source FROM edit_history ORDER BY id DESC LIMIT 1').get() as any;
    expect(row.source).toBe('USER');

    // Invalid source is rejected
    expect(() => {
      db.prepare(`
        INSERT INTO edit_history (entity_type, entity_id, field, source)
        VALUES ('titles', ?, 'rating', 'SYSTEM')
      `).run(titleId);
    }).toThrow(/CHECK constraint failed/);
  });

  it('collections table includes sort_order column', () => {
    // Built-in collections should have default sort_order of 0
    const builtins = db.prepare('SELECT sort_order FROM collections WHERE is_builtin = 1').all() as any[];
    for (const row of builtins) {
      expect(row.sort_order).toBe(0);
    }

    // Custom collection with explicit sort_order
    db.prepare('INSERT INTO collections (name, sort_order) VALUES (?, ?)').run('My List', 5);
    const custom = db.prepare("SELECT sort_order FROM collections WHERE name = 'My List'").get() as any;
    expect(custom.sort_order).toBe(5);
  });
});
