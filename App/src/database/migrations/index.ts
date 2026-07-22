import Database from 'better-sqlite3';
import { migration as initialSchema } from './001_initial_schema';
import { migration as personalTags } from './002_personal_tags';
import { migration as cacheEntries } from './003_cache_entries';

/**
 * Migration runner scaffold.
 * In Phase 2, this will receive the schema and run migrations in order.
 * Currently, it is an empty scaffold that does nothing, satisfying Module 01 requirements.
 */
export function runMigrations(db: Database.Database): void {
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
  const appliedMigrations = stmt.all() as { name: string }[];
  
  // List of pending migrations
  const migrations: Array<{ name: string; up: string }> = [
    initialSchema,
    personalTags,
    cacheEntries
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
