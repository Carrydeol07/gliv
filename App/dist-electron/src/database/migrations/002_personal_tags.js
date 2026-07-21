"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migration = void 0;
exports.migration = {
    name: '002_personal_tags',
    up: `
    CREATE TABLE personal_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE title_personal_tags (
      title_id INTEGER NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
      personal_tag_id INTEGER NOT NULL REFERENCES personal_tags(id) ON DELETE CASCADE,
      UNIQUE(title_id, personal_tag_id)
    );
  `
};
