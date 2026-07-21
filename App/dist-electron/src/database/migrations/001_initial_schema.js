"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migration = void 0;
exports.migration = {
    name: '001_initial_schema',
    up: `
    -- 1. providers
    CREATE TABLE providers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      priority INTEGER NOT NULL,
      capabilities TEXT,
      api_config TEXT
    );
    INSERT INTO providers (id, name, priority) VALUES 
      ('anilist', 'AniList', 1),
      ('jikan', 'Jikan', 2),
      ('mangaupdates', 'MangaUpdates', 1);

    -- 2. titles
    CREATE TABLE titles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_order INTEGER NOT NULL,
      rating REAL,
      favorite BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. formats
    CREATE TABLE formats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title_id INTEGER NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
      media_type TEXT NOT NULL CHECK(media_type IN ('Anime', 'Manga', 'Manhwa', 'Manhua', 'Novel')),
      progress_unit TEXT NOT NULL CHECK(progress_unit IN ('Episode', 'Chapter', 'Volume')),
      personal_progress INTEGER DEFAULT 0,
      status TEXT NOT NULL CHECK(status IN ('Reading', 'Watching', 'Completed', 'Paused', 'Dropped')),
      progress_override INTEGER,
      start_date DATETIME,
      finish_date DATETIME,
      UNIQUE(title_id, media_type)
    );

    -- Trigger to enforce immutability of progress_unit
    CREATE TRIGGER format_progress_unit_immutable
    AFTER UPDATE ON formats
    WHEN OLD.progress_unit != NEW.progress_unit
    BEGIN
      SELECT RAISE(ABORT, 'progress_unit is immutable');
    END;

    -- 4. contributors
    CREATE TABLE contributors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    -- 5. format_contributors
    CREATE TABLE format_contributors (
      format_id INTEGER NOT NULL REFERENCES formats(id) ON DELETE CASCADE,
      contributor_id INTEGER NOT NULL REFERENCES contributors(id) ON DELETE CASCADE,
      role TEXT NOT NULL CHECK(role IN ('Author', 'Artist')),
      UNIQUE(contributor_id, format_id, role)
    );

    -- 6. connections
    CREATE TABLE connections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_title_id INTEGER NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
      to_title_id INTEGER NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
      relationship TEXT NOT NULL CHECK(relationship IN (
        'Prequel', 'Sequel', 'Continuation', 'Spin-off', 'Side Story', 
        'Shared Universe', 'Adaptation', 'Original Source', 'Remake', 'Reboot', 'Crossover'
      ))
    );

    -- 7. collections
    CREATE TABLE collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      is_builtin BOOLEAN DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
    INSERT INTO collections (name, is_builtin) VALUES 
      ('Favorites', 1),
      ('Plan to Watch / Read', 1);

    -- 8. collection_items
    CREATE TABLE collection_items (
      collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
      title_id INTEGER NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
      UNIQUE(collection_id, title_id)
    );

    -- 9. notes
    CREATE TABLE notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title_id INTEGER NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
      content TEXT NOT NULL
    );

    -- 10. metadata
    CREATE TABLE metadata (
      title_id INTEGER NOT NULL UNIQUE REFERENCES titles(id) ON DELETE CASCADE,
      synopsis TEXT
    );

    -- 11. genres & title_genres
    CREATE TABLE genres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
    CREATE TABLE title_genres (
      title_id INTEGER NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
      genre_id INTEGER NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
      UNIQUE(title_id, genre_id)
    );

    -- 12. tags & title_tags
    CREATE TABLE tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
    CREATE TABLE title_tags (
      title_id INTEGER NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
      tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
      UNIQUE(title_id, tag_id)
    );

    -- 13. characters & title_characters
    CREATE TABLE characters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
    CREATE TABLE title_characters (
      title_id INTEGER NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
      character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      UNIQUE(title_id, character_id)
    );

    -- 14. alternative_titles
    CREATE TABLE alternative_titles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title_id INTEGER NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
      alt_title TEXT NOT NULL
    );

    -- 15. publication_info
    CREATE TABLE publication_info (
      format_id INTEGER NOT NULL UNIQUE REFERENCES formats(id) ON DELETE CASCADE,
      publication_status TEXT,
      start_date TEXT,
      end_date TEXT,
      chapter_count INTEGER,
      episode_count INTEGER,
      volume_count INTEGER,
      latest_official_release INTEGER,
      latest_scanlation_release INTEGER,
      official_publisher TEXT,
      license_status TEXT
    );

    -- 16. official_platforms
    CREATE TABLE official_platforms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      format_id INTEGER NOT NULL REFERENCES formats(id) ON DELETE CASCADE,
      platform_name TEXT NOT NULL
    );

    -- 17. scanlation_groups
    CREATE TABLE scanlation_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      format_id INTEGER NOT NULL REFERENCES formats(id) ON DELETE CASCADE,
      group_name TEXT NOT NULL,
      latest_release INTEGER,
      release_date TEXT,
      translation_status TEXT,
      active_status TEXT
    );

    -- 18. external_references
    CREATE TABLE external_references (
      format_id INTEGER NOT NULL REFERENCES formats(id) ON DELETE CASCADE,
      provider_id TEXT NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
      provider_entity_id TEXT NOT NULL,
      confidence REAL,
      verification_state TEXT NOT NULL CHECK(verification_state IN ('AUTO', 'PENDING', 'USER_CONFIRMED', 'USER_REJECTED')),
      last_verified DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(format_id, provider_id)
    );

    -- 19. sync_history
    CREATE TABLE sync_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider_id TEXT REFERENCES providers(id),
      sync_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      result TEXT,
      duration_ms INTEGER
    );

    -- 20. edit_history
    CREATE TABLE edit_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL,
      entity_id INTEGER NOT NULL,
      field TEXT NOT NULL,
      old_value TEXT,
      new_value TEXT,
      source TEXT NOT NULL CHECK(source IN ('USER', 'PROVIDER_SYNC')) DEFAULT 'USER',
      edit_time DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `
};
