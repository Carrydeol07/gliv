import { DatabaseService } from '../../database/DatabaseService';

export class LibraryMutationService {
  constructor(private dbService: DatabaseService) {}

  private logEditHistory(
    db: any,
    entityType: 'TITLE' | 'FORMAT',
    entityId: number,
    field: string,
    oldValue: any,
    newValue: any
  ) {
    if (oldValue === newValue) return;
    const stmt = db.prepare(`
      INSERT INTO edit_history (entity_type, entity_id, field, old_value, new_value, source)
      VALUES (?, ?, ?, ?, ?, 'USER')
    `);
    stmt.run(
      entityType,
      entityId,
      field,
      oldValue !== null && oldValue !== undefined ? String(oldValue) : null,
      newValue !== null && newValue !== undefined ? String(newValue) : null
    );
  }

  public editProgress(formatId: number, newProgress: number): void {
    const db = this.dbService.getDb();
    db.transaction(() => {
      const row = db.prepare(`SELECT personal_progress FROM formats WHERE id = ?`).get(formatId) as { personal_progress: number };
      if (!row) throw new Error('Format not found');

      db.prepare(`UPDATE formats SET personal_progress = ? WHERE id = ?`).run(newProgress, formatId);
      this.logEditHistory(db, 'FORMAT', formatId, 'personal_progress', row.personal_progress, newProgress);
    })();
  }

  public changeStatus(formatId: number, newStatus: string): void {
    const db = this.dbService.getDb();
    db.transaction(() => {
      const row = db.prepare(`SELECT status FROM formats WHERE id = ?`).get(formatId) as { status: string };
      if (!row) throw new Error('Format not found');

      db.prepare(`UPDATE formats SET status = ? WHERE id = ?`).run(newStatus, formatId);
      this.logEditHistory(db, 'FORMAT', formatId, 'status', row.status, newStatus);
    })();
  }

  public editRating(titleId: number, newRating: number | null): void {
    const db = this.dbService.getDb();
    // Rating must be between 1.0 and 10.0 in 0.5 increments
    if (newRating !== null) {
      if (newRating < 1.0 || newRating > 10.0 || (newRating * 10) % 5 !== 0) {
        throw new Error('Rating must be between 1.0 and 10.0 in 0.5 increments');
      }
    }

    db.transaction(() => {
      const row = db.prepare(`SELECT rating FROM titles WHERE id = ?`).get(titleId) as { rating: number | null };
      if (!row) throw new Error('Title not found');

      db.prepare(`UPDATE titles SET rating = ? WHERE id = ?`).run(newRating, titleId);
      this.logEditHistory(db, 'TITLE', titleId, 'rating', row.rating, newRating);
    })();
  }

  public toggleFavorite(titleId: number): void {
    const db = this.dbService.getDb();
    db.transaction(() => {
      const row = db.prepare(`SELECT favorite FROM titles WHERE id = ?`).get(titleId) as { favorite: number };
      if (!row) throw new Error('Title not found');

      const isFav = Boolean(row.favorite);
      const newFav = !isFav;
      db.prepare(`UPDATE titles SET favorite = ? WHERE id = ?`).run(newFav ? 1 : 0, titleId);
      this.logEditHistory(db, 'TITLE', titleId, 'favorite', isFav ? '1' : '0', newFav ? '1' : '0');
    })();
  }

  public editNotes(titleId: number, newNotes: string): void {
    const db = this.dbService.getDb();
    db.transaction(() => {
      const row = db.prepare(`SELECT content FROM notes WHERE title_id = ?`).get(titleId) as { content: string } | undefined;
      const oldNotes = row ? row.content : null;

      if (row) {
        db.prepare(`UPDATE notes SET content = ? WHERE title_id = ?`).run(newNotes, titleId);
      } else {
        db.prepare(`INSERT INTO notes (title_id, content) VALUES (?, ?)`).run(titleId, newNotes);
      }
      this.logEditHistory(db, 'TITLE', titleId, 'notes', oldNotes, newNotes);
    })();
  }

  public toggleCollection(titleId: number, collectionId: number): void {
    const db = this.dbService.getDb();
    db.transaction(() => {
      const row = db.prepare(`SELECT collection_id FROM collection_items WHERE title_id = ? AND collection_id = ?`).get(titleId, collectionId);
      
      if (row) {
        db.prepare(`DELETE FROM collection_items WHERE title_id = ? AND collection_id = ?`).run(titleId, collectionId);
        this.logEditHistory(db, 'TITLE', titleId, 'collection_removed', collectionId, null);
      } else {
        db.prepare(`INSERT INTO collection_items (title_id, collection_id) VALUES (?, ?)`).run(titleId, collectionId);
        this.logEditHistory(db, 'TITLE', titleId, 'collection_added', null, collectionId);
      }
    })();
  }
}
