import { DatabaseService } from '../../database/DatabaseService';
import { NormalizedSearchResult } from '../../models/provider.types';
import { Matcher } from './Matcher';
import { Committer } from './Committer';
import { ImportCandidate, ImportReviewAction, CommitPayload } from './types';

export class ImportEngine {
  private matcher: Matcher;
  private committer: Committer;

  constructor(private dbService: DatabaseService) {
    this.matcher = new Matcher(dbService);
    this.committer = new Committer(dbService);
  }

  public async processSearchImport(importedData: NormalizedSearchResult): Promise<ImportCandidate | null> {
    return this.processImport(importedData, true);
  }

  public async processAddAnotherFormat(importedData: NormalizedSearchResult, targetTitleId: number): Promise<ImportCandidate | null> {
    const candidate = await this.processImport(importedData, false);
    if (!candidate) return null; // Was bypassed deterministically

    // Override library match for "Add Another Format" since we already know the target title
    candidate.existingLibraryMatch = {
      titleId: targetTitleId,
      confidence: 1.0
    };
    
    // In this specific flow, since we are adding to a known title, the suggested action is MERGE
    candidate.suggestedAction = ImportReviewAction.MERGE;

    return candidate;
  }

  private async processImport(importedData: NormalizedSearchResult, performLibraryMatch: boolean): Promise<ImportCandidate | null> {
    const providerMatch = await this.matcher.getProviderIdentityMatch(importedData);
    const libraryMatch = performLibraryMatch ? await this.matcher.getLibraryDuplicateMatch(importedData) : null;

    if (providerMatch) {
      const db = this.dbService.getDb();
      const existingRef = db.prepare(`
        SELECT format_id, verification_state 
        FROM external_references 
        WHERE provider_id = ? AND provider_entity_id = ?
      `).get(providerMatch.providerId, providerMatch.providerEntityId) as { format_id: number, verification_state: string } | undefined;

      if (existingRef) {
        if (existingRef.verification_state === 'AUTO' || existingRef.verification_state === 'USER_CONFIRMED') {
          // Bypasses Import Review entirely, just update last_verified
          db.prepare(`
            UPDATE external_references 
            SET last_verified = CURRENT_TIMESTAMP, confidence = ?
            WHERE provider_id = ? AND provider_entity_id = ?
          `).run(providerMatch.confidence, providerMatch.providerId, providerMatch.providerEntityId);
          return null; // Signals bypass
        }
        
        if (existingRef.verification_state === 'USER_REJECTED') {
           // Never automatically retry
           return null;
        }

        if (existingRef.verification_state === 'PENDING') {
          // Pending Match Management: reuse existing pending match, update confidence but NOT last_verified
          db.prepare(`
            UPDATE external_references 
            SET confidence = ?
            WHERE provider_id = ? AND provider_entity_id = ?
          `).run(providerMatch.confidence, providerMatch.providerId, providerMatch.providerEntityId);
          
          return {
            importedData,
            suggestedProviderMatch: providerMatch,
            existingLibraryMatch: libraryMatch, 
            confidence: providerMatch.confidence,
            suggestedAction: libraryMatch ? ImportReviewAction.MERGE : ImportReviewAction.CREATE_NEW_TITLE
          };
        }
      }
    }

    // Default Import Review required
    return {
      importedData,
      suggestedProviderMatch: providerMatch,
      existingLibraryMatch: libraryMatch,
      confidence: providerMatch ? providerMatch.confidence : 0,
      suggestedAction: libraryMatch ? ImportReviewAction.MERGE : ImportReviewAction.CREATE_NEW_TITLE
    };
  }

  public async commitAction(payload: CommitPayload): Promise<void> {
    await this.committer.commit(payload);
  }
}
