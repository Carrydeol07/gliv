import { NormalizedSearchResult } from '../../models/provider.types';
import { DatabaseService } from '../../database/DatabaseService';
import { ProviderIdentityMatch, LibraryDuplicateMatch } from './types';

export class Matcher {
  constructor(private dbService: DatabaseService) {}

  public async getProviderIdentityMatch(
    importedData: NormalizedSearchResult
  ): Promise<ProviderIdentityMatch | null> {
    // For Search Import, the importedData is already tied to a provider reference.
    if (importedData.providerReferences && importedData.providerReferences.length > 0) {
      const ref = importedData.providerReferences[0];
      return {
        providerId: ref.providerId,
        providerEntityId: ref.providerEntityId,
        confidence: 1.0 // Search results have a direct deterministic link
      };
    }
    
    // In a future DOCX import module, this would call ProviderManager.search() and do fuzzy matching.
    return null;
  }

  public async getLibraryDuplicateMatch(
    importedData: NormalizedSearchResult
  ): Promise<LibraryDuplicateMatch | null> {
    const db = this.dbService.getDb();
    
    // 1. Try to match by External Reference (most reliable)
    if (importedData.providerReferences && importedData.providerReferences.length > 0) {
      for (const ref of importedData.providerReferences) {
        const row = db.prepare(`
          SELECT f.id as format_id, f.title_id 
          FROM external_references er
          JOIN formats f ON er.format_id = f.id
          WHERE er.provider_id = ? AND er.provider_entity_id = ?
        `).get(ref.providerId, ref.providerEntityId) as { format_id: number, title_id: number } | undefined;

        if (row) {
          return {
            titleId: row.title_id,
            formatId: row.format_id,
            confidence: 1.0
          };
        }
      }
    }

    // 2. Try to match by Alternative Titles (fuzzy)
    const searchTitles = [importedData.title, ...importedData.alternativeTitles];
    for (const searchTitle of searchTitles) {
       if (!searchTitle) continue;
       const row = db.prepare(`
         SELECT t.id as title_id 
         FROM alternative_titles at
         JOIN titles t ON at.title_id = t.id
         WHERE at.alt_title = ?
       `).get(searchTitle) as { title_id: number } | undefined;
       
       if (row) {
         return {
           titleId: row.title_id,
           confidence: 0.8
         };
       }
    }
    
    return null;
  }
}
