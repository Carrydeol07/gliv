export const migration = {
  name: '003_cache_entries',
  up: `
    CREATE TABLE cache_entries (
      key TEXT PRIMARY KEY,
      provider_id TEXT NOT NULL,
      provider_entity_id TEXT,
      capability TEXT NOT NULL,
      payload TEXT NOT NULL,
      cached_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      orphaned_at INTEGER
    );
  `
};
