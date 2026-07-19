import { DatabaseService } from '../../database/DatabaseService';
import { CommitPayload, ImportReviewAction } from './types';

export class Committer {
  constructor(private dbService: DatabaseService) {}

  public async commit(payload: CommitPayload): Promise<void> {
    const db = this.dbService.getDb();

    // Wrap the entire commit in a transaction to ensure reversibility and atomicity
    const executeTransaction = db.transaction(() => {
      switch (payload.action) {
        case ImportReviewAction.MERGE:
          this.handleMerge(payload);
          break;
        case ImportReviewAction.CREATE_NEW_TITLE:
          this.handleCreateNewTitle(payload);
          break;
        case ImportReviewAction.CREATE_MANUAL_TITLE:
          this.handleCreateManualTitle(payload);
          break;
        case ImportReviewAction.SEARCH_AGAIN:
        case ImportReviewAction.SKIP:
          // No DB writes for these actions
          break;
        default:
          throw new Error(`Unknown action: ${payload.action}`);
      }
    });

    executeTransaction();
  }

  private handleMerge(payload: CommitPayload): void {
    if (!payload.targetTitleId) {
      throw new Error('MERGE action requires a targetTitleId');
    }

    const db = this.dbService.getDb();
    
    // Check if the format already exists for this title
    const mediaType = payload.candidate.importedData.formats[0] || 'Anime';
    const dbMediaType = mediaType.charAt(0).toUpperCase() + mediaType.slice(1).toLowerCase();
    const format = db.prepare(`
      SELECT id, progress_override FROM formats 
      WHERE title_id = ? AND media_type = ?
    `).get(payload.targetTitleId, dbMediaType) as { id: number, progress_override: number | null } | undefined;

    let formatId: number;

    if (format) {
      formatId = format.id;
      // We are merging into an existing format.
      const existingRef = db.prepare(`
        SELECT provider_id, provider_entity_id 
        FROM external_references WHERE format_id = ?
      `).get(formatId) as { provider_id: string, provider_entity_id: string } | undefined;

      const providerRef = payload.candidate.suggestedProviderMatch;

      if (providerRef) {
        if (existingRef) {
          if (existingRef.provider_id !== providerRef.providerId || existingRef.provider_entity_id !== providerRef.providerEntityId) {
             // Provider reference changed!
             // BR-003: Auto-remove any existing Progress Override and log to edit_history
             if (format.progress_override !== null) {
               db.prepare(`UPDATE formats SET progress_override = NULL WHERE id = ?`).run(formatId);
               
               db.prepare(`
                 INSERT INTO edit_history (entity_type, entity_id, field, old_value, new_value, source)
                 VALUES (?, ?, ?, ?, ?, ?)
               `).run(
                 'FORMAT', 
                 formatId, 
                 'Progress Override Removed (Provider Reference Changed)', 
                 format.progress_override.toString(), 
                 null, 
                 'USER'
               );
             }
             
             // Update the external reference
             db.prepare(`
               UPDATE external_references 
               SET provider_id = ?, provider_entity_id = ?, confidence = ?, verification_state = ?, last_verified = CURRENT_TIMESTAMP
               WHERE format_id = ?
             `).run(providerRef.providerId, providerRef.providerEntityId, providerRef.confidence, 'USER_CONFIRMED', formatId);
          } else {
             // Just update state to confirmed
             db.prepare(`
               UPDATE external_references 
               SET verification_state = 'USER_CONFIRMED', confidence = ?, last_verified = CURRENT_TIMESTAMP
               WHERE format_id = ? AND provider_id = ?
             `).run(providerRef.confidence, formatId, providerRef.providerId);
          }
        } else {
          // Insert new external reference
          db.prepare(`
            INSERT INTO external_references (format_id, provider_id, provider_entity_id, confidence, verification_state)
            VALUES (?, ?, ?, ?, ?)
          `).run(formatId, providerRef.providerId, providerRef.providerEntityId, providerRef.confidence, 'USER_CONFIRMED');
        }
      }
    } else {
      // Create new format under existing title
      const result = db.prepare(`
        INSERT INTO formats (title_id, media_type, progress_unit, status)
        VALUES (?, ?, 'Episode', 'Reading')
      `).run(payload.targetTitleId, dbMediaType);
      
      formatId = result.lastInsertRowid as number;

      // Add provider link
      const providerRef = payload.candidate.suggestedProviderMatch;
      if (providerRef) {
        db.prepare(`
          INSERT INTO external_references (format_id, provider_id, provider_entity_id, confidence, verification_state)
          VALUES (?, ?, ?, ?, ?)
        `).run(formatId, providerRef.providerId, providerRef.providerEntityId, providerRef.confidence, 'USER_CONFIRMED');
      }
    }
  }

  private handleCreateNewTitle(payload: CommitPayload): void {
    const db = this.dbService.getDb();
    
    // Insert new Title (using max original_order + 1 or just a placeholder logic for original_order)
    const result = db.prepare(`
      INSERT INTO titles (original_order) VALUES ((SELECT COALESCE(MAX(original_order), 0) + 1 FROM titles))
    `).run();
    const titleId = result.lastInsertRowid as number;

    const mediaType = payload.candidate.importedData.formats[0] || 'Anime';
    const dbMediaType = mediaType.charAt(0).toUpperCase() + mediaType.slice(1).toLowerCase();

    // Insert Format
    const formatResult = db.prepare(`
      INSERT INTO formats (title_id, media_type, progress_unit, status)
      VALUES (?, ?, 'Episode', 'Reading')
    `).run(titleId, dbMediaType);
    const formatId = formatResult.lastInsertRowid as number;

    // Add external reference
    const providerRef = payload.candidate.suggestedProviderMatch;
    if (providerRef) {
      db.prepare(`
        INSERT INTO external_references (format_id, provider_id, provider_entity_id, confidence, verification_state)
        VALUES (?, ?, ?, ?, ?)
      `).run(formatId, providerRef.providerId, providerRef.providerEntityId, providerRef.confidence, 'USER_CONFIRMED');
    }

    // Also add to alternative titles
    db.prepare(`INSERT INTO alternative_titles (title_id, alt_title) VALUES (?, ?)`).run(titleId, payload.candidate.importedData.title);
  }

  private handleCreateManualTitle(payload: CommitPayload): void {
    const db = this.dbService.getDb();
    
    // Insert new Title
    const result = db.prepare(`
      INSERT INTO titles (original_order) VALUES ((SELECT COALESCE(MAX(original_order), 0) + 1 FROM titles))
    `).run();
    const titleId = result.lastInsertRowid as number;

    const mediaType = payload.candidate.importedData.formats[0] || 'Anime';
    const dbMediaType = mediaType.charAt(0).toUpperCase() + mediaType.slice(1).toLowerCase();

    // Insert Format
    // CRITICAL: Manual Title MUST NOT have a provider link (external reference).
    db.prepare(`
      INSERT INTO formats (title_id, media_type, progress_unit, status)
      VALUES (?, ?, 'Episode', 'Reading')
    `).run(titleId, dbMediaType);

    // Also add to alternative titles
    db.prepare(`INSERT INTO alternative_titles (title_id, alt_title) VALUES (?, ?)`).run(titleId, payload.candidate.importedData.title);
  }
}
