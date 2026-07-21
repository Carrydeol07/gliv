"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = runMigrations;
const _001_initial_schema_1 = require("./001_initial_schema");
const _002_personal_tags_1 = require("./002_personal_tags");
/**
 * Migration runner scaffold.
 * In Phase 2, this will receive the schema and run migrations in order.
 * Currently, it is an empty scaffold that does nothing, satisfying Module 01 requirements.
 */
function runMigrations(db) {
    // Scaffold: Create migrations table if it doesn't exist
    db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
    // Read applied migrations
    const stmt = db.prepare('SELECT name FROM _migrations ORDER BY id ASC');
    const appliedMigrations = stmt.all();
    // List of pending migrations
    const migrations = [
        _001_initial_schema_1.migration,
        _002_personal_tags_1.migration
    ];
    const appliedNames = new Set(appliedMigrations.map(m => m.name));
    for (const migration of migrations) {
        if (!appliedNames.has(migration.name)) {
            console.log(`Applying migration: ${migration.name}`);
            db.exec(migration.up);
            db.prepare('INSERT INTO _migrations (name) VALUES (?)').run(migration.name);
        }
    }
}
