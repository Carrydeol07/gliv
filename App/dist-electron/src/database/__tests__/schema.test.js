"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const migrations_1 = require("../migrations");
/** Helper: insert a title and return its id */
function insertTitle(db, order = 1) {
    const result = db.prepare('INSERT INTO titles (original_order) VALUES (?)').run(order);
    return Number(result.lastInsertRowid);
}
/** Helper: insert a format and return its id */
function insertFormat(db, titleId, mediaType = 'Anime', progressUnit = 'Episode', status = 'Watching') {
    const result = db.prepare(`
    INSERT INTO formats (title_id, media_type, progress_unit, status) 
    VALUES (?, ?, ?, ?)
  `).run(titleId, mediaType, progressUnit, status);
    return Number(result.lastInsertRowid);
}
(0, vitest_1.describe)('Database Schema (Module 02)', () => {
    let db;
    (0, vitest_1.beforeEach)(() => {
        // In-memory database for testing
        db = new better_sqlite3_1.default(':memory:');
        (0, migrations_1.runMigrations)(db);
    });
    (0, vitest_1.afterEach)(() => {
        db.close();
    });
    (0, vitest_1.it)('runs migrations cleanly on an empty database', () => {
        const tableInfo = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        const tables = tableInfo.map(t => t.name);
        (0, vitest_1.expect)(tables).toContain('titles');
        (0, vitest_1.expect)(tables).toContain('formats');
        (0, vitest_1.expect)(tables).toContain('providers');
        (0, vitest_1.expect)(tables).toContain('edit_history');
        (0, vitest_1.expect)(tables).toContain('collections');
    });
    (0, vitest_1.it)('seeds exactly 3 providers and excludes Comick', () => {
        const providers = db.prepare('SELECT id FROM providers').all();
        const providerIds = providers.map(p => p.id);
        (0, vitest_1.expect)(providerIds).toHaveLength(3);
        (0, vitest_1.expect)(providerIds).toContain('anilist');
        (0, vitest_1.expect)(providerIds).toContain('jikan');
        (0, vitest_1.expect)(providerIds).toContain('mangaupdates');
        (0, vitest_1.expect)(providerIds).not.toContain('comick');
    });
    (0, vitest_1.it)('titles table includes original_order, rating, and favorite columns', () => {
        const titleId = insertTitle(db, 1);
        // Update rating and favorite
        db.prepare('UPDATE titles SET rating = 8.5, favorite = 1 WHERE id = ?').run(titleId);
        const row = db.prepare('SELECT original_order, rating, favorite FROM titles WHERE id = ?').get(titleId);
        (0, vitest_1.expect)(row.original_order).toBe(1);
        (0, vitest_1.expect)(row.rating).toBe(8.5);
        (0, vitest_1.expect)(row.favorite).toBe(1);
    });
    (0, vitest_1.it)('formats table includes media_type column with CHECK constraint', () => {
        const titleId = insertTitle(db);
        // Valid media type works
        (0, vitest_1.expect)(() => insertFormat(db, titleId, 'Manga', 'Chapter', 'Reading')).not.toThrow();
        // Invalid media type is rejected
        (0, vitest_1.expect)(() => {
            db.prepare(`
        INSERT INTO formats (title_id, media_type, progress_unit, status) 
        VALUES (?, 'Comic', 'Chapter', 'Reading')
      `).run(titleId);
        }).toThrow(/CHECK constraint failed/);
    });
    (0, vitest_1.it)('enforces UNIQUE(title_id, media_type) — one Format per media type per Title', () => {
        const titleId = insertTitle(db);
        insertFormat(db, titleId, 'Anime', 'Episode', 'Watching');
        // Second Anime format for same title is rejected
        (0, vitest_1.expect)(() => {
            insertFormat(db, titleId, 'Anime', 'Episode', 'Watching');
        }).toThrow(/UNIQUE constraint failed/);
        // Different media type for same title is allowed
        (0, vitest_1.expect)(() => {
            insertFormat(db, titleId, 'Manga', 'Chapter', 'Reading');
        }).not.toThrow();
    });
    (0, vitest_1.it)('enforces formats.progress_unit immutability via trigger', () => {
        const titleId = insertTitle(db);
        const formatId = insertFormat(db, titleId, 'Anime', 'Episode', 'Watching');
        // Allowed: Update a different column (e.g., personal_progress)
        (0, vitest_1.expect)(() => {
            db.prepare('UPDATE formats SET personal_progress = 10 WHERE id = ?').run(formatId);
        }).not.toThrow();
        // Blocked: Try to change progress_unit
        (0, vitest_1.expect)(() => {
            db.prepare('UPDATE formats SET progress_unit = ? WHERE id = ?').run('Chapter', formatId);
        }).toThrow('progress_unit is immutable');
    });
    (0, vitest_1.it)('enforces external_references unique constraint on (format_id, provider_id)', () => {
        const titleId = insertTitle(db);
        const formatId = insertFormat(db, titleId);
        // Insert first reference
        db.prepare(`
      INSERT INTO external_references (format_id, provider_id, provider_entity_id, verification_state)
      VALUES (?, 'anilist', '123', 'AUTO')
    `).run(formatId);
        // Try to insert a second reference for the same format and provider
        (0, vitest_1.expect)(() => {
            db.prepare(`
        INSERT INTO external_references (format_id, provider_id, provider_entity_id, verification_state)
        VALUES (?, 'anilist', '456', 'PENDING')
      `).run(formatId);
        }).toThrow(/UNIQUE constraint failed/);
    });
    (0, vitest_1.it)('enforces publication_info one-to-one unique constraint', () => {
        const titleId = insertTitle(db);
        const formatId = insertFormat(db, titleId);
        db.prepare('INSERT INTO publication_info (format_id) VALUES (?)').run(formatId);
        (0, vitest_1.expect)(() => {
            db.prepare('INSERT INTO publication_info (format_id) VALUES (?)').run(formatId);
        }).toThrow(/UNIQUE constraint failed/);
    });
    (0, vitest_1.it)('enforces metadata one-to-one unique constraint', () => {
        const titleId = insertTitle(db);
        db.prepare('INSERT INTO metadata (title_id) VALUES (?)').run(titleId);
        (0, vitest_1.expect)(() => {
            db.prepare('INSERT INTO metadata (title_id) VALUES (?)').run(titleId);
        }).toThrow(/UNIQUE constraint failed/);
    });
    (0, vitest_1.it)('blocks orphaned inserts via foreign keys', () => {
        // Foreign keys must be enabled in sqlite
        db.pragma('foreign_keys = ON');
        (0, vitest_1.expect)(() => {
            db.prepare(`
        INSERT INTO formats (title_id, media_type, progress_unit, status) 
        VALUES (999, 'Anime', 'Episode', 'Watching')
      `).run();
        }).toThrow(/FOREIGN KEY constraint failed/);
    });
    (0, vitest_1.it)('edit_history includes source column with CHECK constraint', () => {
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
        const row = db.prepare('SELECT source FROM edit_history ORDER BY id DESC LIMIT 1').get();
        (0, vitest_1.expect)(row.source).toBe('USER');
        // Invalid source is rejected
        (0, vitest_1.expect)(() => {
            db.prepare(`
        INSERT INTO edit_history (entity_type, entity_id, field, source)
        VALUES ('titles', ?, 'rating', 'SYSTEM')
      `).run(titleId);
        }).toThrow(/CHECK constraint failed/);
    });
    (0, vitest_1.it)('collections table includes sort_order column', () => {
        // Built-in collections should have default sort_order of 0
        const builtins = db.prepare('SELECT sort_order FROM collections WHERE is_builtin = 1').all();
        for (const row of builtins) {
            (0, vitest_1.expect)(row.sort_order).toBe(0);
        }
        // Custom collection with explicit sort_order
        db.prepare('INSERT INTO collections (name, sort_order) VALUES (?, ?)').run('My List', 5);
        const custom = db.prepare("SELECT sort_order FROM collections WHERE name = 'My List'").get();
        (0, vitest_1.expect)(custom.sort_order).toBe(5);
    });
    (0, vitest_1.it)('allows personal_tags to be created and attached to multiple titles', () => {
        const titleId1 = insertTitle(db);
        const titleId2 = insertTitle(db);
        const result = db.prepare('INSERT INTO personal_tags (name) VALUES (?)').run('MyTag');
        const tagId = Number(result.lastInsertRowid);
        // Attach to title 1
        (0, vitest_1.expect)(() => {
            db.prepare('INSERT INTO title_personal_tags (title_id, personal_tag_id) VALUES (?, ?)').run(titleId1, tagId);
        }).not.toThrow();
        // Attach to title 2
        (0, vitest_1.expect)(() => {
            db.prepare('INSERT INTO title_personal_tags (title_id, personal_tag_id) VALUES (?, ?)').run(titleId2, tagId);
        }).not.toThrow();
        // Reject duplicate attachment
        (0, vitest_1.expect)(() => {
            db.prepare('INSERT INTO title_personal_tags (title_id, personal_tag_id) VALUES (?, ?)').run(titleId1, tagId);
        }).toThrow(/UNIQUE constraint failed/);
    });
    (0, vitest_1.it)('cascades personal_tag deletion without deleting the title', () => {
        db.pragma('foreign_keys = ON');
        const titleId = insertTitle(db);
        const tagId = Number(db.prepare('INSERT INTO personal_tags (name) VALUES (?)').run('DeleteMe').lastInsertRowid);
        db.prepare('INSERT INTO title_personal_tags (title_id, personal_tag_id) VALUES (?, ?)').run(titleId, tagId);
        // Verify it exists
        (0, vitest_1.expect)(db.prepare('SELECT count(*) as count FROM title_personal_tags WHERE personal_tag_id = ?').get(tagId).count).toBe(1);
        // Delete tag
        db.prepare('DELETE FROM personal_tags WHERE id = ?').run(tagId);
        // Verify mapping is gone
        (0, vitest_1.expect)(db.prepare('SELECT count(*) as count FROM title_personal_tags WHERE personal_tag_id = ?').get(tagId).count).toBe(0);
        // Verify title still exists
        (0, vitest_1.expect)(db.prepare('SELECT count(*) as count FROM titles WHERE id = ?').get(titleId).count).toBe(1);
    });
    (0, vitest_1.it)('keeps personal_tags strictly independent of other systems', () => {
        // Check there are no foreign keys from other tables referencing personal_tags
        const fks = db.prepare("PRAGMA foreign_key_list('tags')").all();
        (0, vitest_1.expect)(fks.find(fk => fk.table === 'personal_tags')).toBeUndefined();
        const extFks = db.prepare("PRAGMA foreign_key_list('external_references')").all();
        (0, vitest_1.expect)(extFks.find(fk => fk.table === 'personal_tags')).toBeUndefined();
        const syncFks = db.prepare("PRAGMA foreign_key_list('sync_history')").all();
        (0, vitest_1.expect)(syncFks.find(fk => fk.table === 'personal_tags')).toBeUndefined();
    });
});
