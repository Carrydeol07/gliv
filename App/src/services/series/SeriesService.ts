import { DatabaseService } from '../../database/DatabaseService';

export interface SeriesData {
  title: any;
  alternativeTitles: any[];
  formats: any[];
  metadata: any;
  notes: any;
  connections: any[];
  contributors: any[];
  collections: any[]; // Full list of collections
  collectionItems: any[]; // Collections this title belongs to
}

export class SeriesService {
  constructor(private dbService: DatabaseService) {}

  public getSeriesData(titleId: number): SeriesData {
    const db = this.dbService.getDb();
    
    const title = db.prepare(`SELECT * FROM titles WHERE id = ?`).get(titleId);
    if (!title) {
      throw new Error('Title not found');
    }

    const alternativeTitles = db.prepare(`SELECT * FROM alternative_titles WHERE title_id = ?`).all(titleId);
    const metadata = db.prepare(`SELECT * FROM metadata WHERE title_id = ?`).get(titleId);

    const formats = db.prepare(`
      SELECT f.*, er.verification_state
      FROM formats f
      LEFT JOIN external_references er ON f.id = er.format_id AND er.verification_state IN ('AUTO', 'USER_CONFIRMED')
      WHERE f.title_id = ?
    `).all(titleId) as any[];

    for (const format of formats) {
      // publication_info
      format.publicationInfo = db.prepare(`SELECT * FROM publication_info WHERE format_id = ?`).get(format.id);
      
      // official_platforms
      format.officialPlatforms = db.prepare(`SELECT * FROM official_platforms WHERE format_id = ?`).all(format.id);
      
      // scanlation_groups
      format.scanlationGroups = db.prepare(`SELECT * FROM scanlation_groups WHERE format_id = ?`).all(format.id);
    }

    const notes = db.prepare(`SELECT * FROM notes WHERE title_id = ?`).get(titleId);

    const connections = db.prepare(`
      SELECT c.*, t.rating, t.favorite, at.alt_title as display_title
      FROM connections c
      JOIN titles t ON c.to_title_id = t.id
      LEFT JOIN alternative_titles at ON t.id = at.title_id
      WHERE c.from_title_id = ?
      GROUP BY c.id
    `).all(titleId);

    const contributors = db.prepare(`
      SELECT fc.role, c.id, c.name, fc.format_id
      FROM format_contributors fc
      JOIN contributors c ON fc.contributor_id = c.id
      WHERE fc.format_id IN (SELECT id FROM formats WHERE title_id = ?)
    `).all(titleId);

    const collections = db.prepare(`SELECT * FROM collections ORDER BY sort_order`).all();
    const collectionItems = db.prepare(`SELECT * FROM collection_items WHERE title_id = ?`).all(titleId);

    return {
      title,
      alternativeTitles,
      formats,
      metadata,
      notes,
      connections,
      contributors,
      collections,
      collectionItems
    };
  }

  public updateProgress(formatId: number, progress: number, status: string): void {
    const db = this.dbService.getDb();
    
    const executeTransaction = db.transaction(() => {
      const format = db.prepare(`SELECT personal_progress, status FROM formats WHERE id = ?`).get(formatId) as any;
      if (!format) throw new Error('Format not found');

      if (format.personal_progress !== progress) {
        db.prepare(`UPDATE formats SET personal_progress = ? WHERE id = ?`).run(progress, formatId);
        db.prepare(`
          INSERT INTO edit_history (entity_type, entity_id, field, old_value, new_value, source)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run('FORMAT', formatId, 'Personal Progress', format.personal_progress.toString(), progress.toString(), 'USER');
      }

      if (format.status !== status) {
        db.prepare(`UPDATE formats SET status = ? WHERE id = ?`).run(status, formatId);
        db.prepare(`
          INSERT INTO edit_history (entity_type, entity_id, field, old_value, new_value, source)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run('FORMAT', formatId, 'Status', format.status, status, 'USER');
      }
    });

    executeTransaction();
  }

  public updateRating(titleId: number, rating: number | null): void {
    const db = this.dbService.getDb();
    
    const executeTransaction = db.transaction(() => {
      const title = db.prepare(`SELECT rating FROM titles WHERE id = ?`).get(titleId) as any;
      if (!title) throw new Error('Title not found');

      db.prepare(`UPDATE titles SET rating = ? WHERE id = ?`).run(rating, titleId);
      db.prepare(`
        INSERT INTO edit_history (entity_type, entity_id, field, old_value, new_value, source)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run('TITLE', titleId, 'Rating', title.rating?.toString() || null, rating?.toString() || null, 'USER');
    });

    executeTransaction();
  }

  public toggleFavorite(titleId: number): void {
    const db = this.dbService.getDb();
    
    const executeTransaction = db.transaction(() => {
      const title = db.prepare(`SELECT favorite FROM titles WHERE id = ?`).get(titleId) as any;
      if (!title) throw new Error('Title not found');

      const newValue = title.favorite ? 0 : 1;
      db.prepare(`UPDATE titles SET favorite = ? WHERE id = ?`).run(newValue, titleId);
      db.prepare(`
        INSERT INTO edit_history (entity_type, entity_id, field, old_value, new_value, source)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run('TITLE', titleId, 'Favorite', title.favorite ? '1' : '0', newValue ? '1' : '0', 'USER');
    });

    executeTransaction();
  }

  public updateNotes(titleId: number, content: string): void {
    const db = this.dbService.getDb();
    
    const executeTransaction = db.transaction(() => {
      const note = db.prepare(`SELECT id, content FROM notes WHERE title_id = ?`).get(titleId) as any;

      if (note) {
        if (note.content !== content) {
          db.prepare(`UPDATE notes SET content = ? WHERE id = ?`).run(content, note.id);
          db.prepare(`
            INSERT INTO edit_history (entity_type, entity_id, field, old_value, new_value, source)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run('TITLE', titleId, 'Notes', note.content, content, 'USER');
        }
      } else {
        db.prepare(`INSERT INTO notes (title_id, content) VALUES (?, ?)`).run(titleId, content);
        db.prepare(`
          INSERT INTO edit_history (entity_type, entity_id, field, old_value, new_value, source)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run('TITLE', titleId, 'Notes', null, content, 'USER');
      }
    });

    executeTransaction();
  }

  public toggleCollectionMembership(titleId: number, collectionId: number): void {
    const db = this.dbService.getDb();
    
    const executeTransaction = db.transaction(() => {
      const exists = db.prepare(`SELECT 1 FROM collection_items WHERE title_id = ? AND collection_id = ?`).get(titleId, collectionId);

      if (exists) {
        db.prepare(`DELETE FROM collection_items WHERE title_id = ? AND collection_id = ?`).run(titleId, collectionId);
        db.prepare(`
          INSERT INTO edit_history (entity_type, entity_id, field, old_value, new_value, source)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run('TITLE', titleId, 'Collection Membership Removed', collectionId.toString(), null, 'USER');
      } else {
        db.prepare(`INSERT INTO collection_items (collection_id, title_id) VALUES (?, ?)`).run(collectionId, titleId);
        db.prepare(`
          INSERT INTO edit_history (entity_type, entity_id, field, old_value, new_value, source)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run('TITLE', titleId, 'Collection Membership Added', null, collectionId.toString(), 'USER');
      }
    });

    executeTransaction();
  }
}
