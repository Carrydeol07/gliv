import { DatabaseService } from '../../database/DatabaseService';

export type OverrideRemovalReason = 'MANUAL' | 'PROVIDER_REFERENCE_CHANGED' | 'PROVIDER_CAUGHT_UP';

export class ProgressService {
  constructor(private dbService: DatabaseService) {}

  /**
   * BR-001: Effective Latest is MAX(Latest Official Release, Latest Scanlation Release, Progress Override)
   * Personal Progress is explicitly EXCLUDED from this calculation.
   * Returns undefined if NO provider value or override exists.
   */
  public calculateEffectiveLatest(
    override: number | null,
    latestOfficial: number | null,
    latestScanlation: number | null
  ): number | undefined {
    const values = [override, latestOfficial, latestScanlation].filter((v): v is number => v !== null && v !== undefined);
    
    if (values.length === 0) {
      return undefined; // Undefined when no provider value exists yet
    }
    
    return Math.max(...values);
  }

  /**
   * BR-001: Remaining = max(Effective Latest - Personal Progress, 0)
   */
  public calculateRemaining(effectiveLatest: number | undefined, personalProgress: number): number | undefined {
    if (effectiveLatest === undefined) return undefined;
    return Math.max(effectiveLatest - personalProgress, 0);
  }

  /**
   * BR-003: Pure function to check if provider data has reached or exceeded the override value.
   */
  public checkProviderCaughtUp(
    override: number | null,
    latestOfficial: number | null,
    latestScanlation: number | null
  ): boolean {
    if (override === null) return false;
    
    const maxProvider = Math.max(
      latestOfficial ?? -Infinity,
      latestScanlation ?? -Infinity
    );
    
    return maxProvider >= override;
  }

  /**
   * BR-003: Create a Progress Override. Must be > personalProgress.
   */
  public createOverride(formatId: number, overrideValue: number): void {
    const db = this.dbService.getDb();
    
    const executeTransaction = db.transaction(() => {
      const format = db.prepare(`SELECT personal_progress FROM formats WHERE id = ?`).get(formatId) as { personal_progress: number } | undefined;
      
      if (!format) throw new Error('Format not found');
      
      if (overrideValue <= format.personal_progress) {
        throw new Error('Progress Override must be strictly greater than Personal Progress');
      }

      db.prepare(`UPDATE formats SET progress_override = ? WHERE id = ?`).run(overrideValue, formatId);

      db.prepare(`
        INSERT INTO edit_history (entity_type, entity_id, field, old_value, new_value, source)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        'FORMAT', 
        formatId, 
        'Progress Override', 
        null, 
        overrideValue.toString(), 
        'USER'
      );
    });

    executeTransaction();
  }

  /**
   * BR-003: Edit a Progress Override. Must be > personalProgress.
   */
  public editOverride(formatId: number, newValue: number): void {
    const db = this.dbService.getDb();
    
    const executeTransaction = db.transaction(() => {
      const format = db.prepare(`SELECT personal_progress, progress_override FROM formats WHERE id = ?`).get(formatId) as { personal_progress: number, progress_override: number | null } | undefined;
      
      if (!format) throw new Error('Format not found');
      if (format.progress_override === null) throw new Error('No override exists to edit');
      
      if (newValue <= format.personal_progress) {
        throw new Error('Progress Override must be strictly greater than Personal Progress');
      }
      
      if (format.progress_override === newValue) {
        return; // No-op
      }

      db.prepare(`UPDATE formats SET progress_override = ? WHERE id = ?`).run(newValue, formatId);

      db.prepare(`
        INSERT INTO edit_history (entity_type, entity_id, field, old_value, new_value, source)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        'FORMAT', 
        formatId, 
        'Progress Override', 
        format.progress_override.toString(), 
        newValue.toString(), 
        'USER'
      );
    });

    executeTransaction();
  }

  /**
   * BR-003: Remove a Progress Override. Reason maps to edit_history string.
   */
  public removeOverride(formatId: number, reason: OverrideRemovalReason): void {
    const db = this.dbService.getDb();
    
    let editHistoryField = 'Progress Override Removed';
    let source = 'USER';
    
    switch (reason) {
      case 'MANUAL':
        editHistoryField = 'Progress Override Removed (Manual)';
        break;
      case 'PROVIDER_REFERENCE_CHANGED':
        editHistoryField = 'Progress Override Removed (Provider Reference Changed)';
        break;
      case 'PROVIDER_CAUGHT_UP':
        editHistoryField = 'Progress Override Removed (Provider Caught Up)';
        source = 'PROVIDER_SYNC';
        break;
    }

    const executeTransaction = db.transaction(() => {
      const format = db.prepare(`SELECT progress_override FROM formats WHERE id = ?`).get(formatId) as { progress_override: number | null } | undefined;
      
      if (!format) throw new Error('Format not found');
      if (format.progress_override === null) return; // Nothing to remove

      db.prepare(`UPDATE formats SET progress_override = NULL WHERE id = ?`).run(formatId);

      db.prepare(`
        INSERT INTO edit_history (entity_type, entity_id, field, old_value, new_value, source)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        'FORMAT', 
        formatId, 
        editHistoryField, 
        format.progress_override.toString(), 
        null, 
        source
      );
    });

    executeTransaction();
  }
}
