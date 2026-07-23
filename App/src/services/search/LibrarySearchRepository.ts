import { DatabaseService } from '../../database/DatabaseService';
import { MediaType, ProviderReference, Contributor } from '../../models/provider.types';
import { SearchResult } from './types';

export class LibrarySearchRepository {
  constructor(private dbService: DatabaseService) {}

  public search(query: string, mediaType: MediaType | null): SearchResult[] {
    const db = this.dbService.getDb();
    
    // We need to match the query against alternative_titles and contributors.
    // A title matches if any of its alt_titles match OR any of its contributors match.
    // The query can be a substring match. We'll use LIKE %query%.
    const likeQuery = `%${query}%`;
    
    // Base CTEs or subqueries to find matching title IDs
    let sql = `
      SELECT DISTINCT t.id as title_id
      FROM titles t
      LEFT JOIN alternative_titles at ON t.id = at.title_id
      LEFT JOIN formats f ON t.id = f.title_id
      LEFT JOIN format_contributors fc ON f.id = fc.format_id
      LEFT JOIN contributors c ON fc.contributor_id = c.id
      WHERE (at.alt_title LIKE ? OR c.name LIKE ?)
    `;
    
    const params: any[] = [likeQuery, likeQuery];
    
    if (mediaType) {
      // media_type in DB is capitalized (Anime, Manga, etc.)
      const dbMediaType = mediaType.charAt(0).toUpperCase() + mediaType.slice(1).toLowerCase();
      sql += ` AND f.media_type = ?`;
      params.push(dbMediaType);
    }
    
    // Execute search for matching title IDs
    const matchingTitleRows = db.prepare(sql).all(...params) as { title_id: number }[];
    const titleIds = matchingTitleRows.map(row => row.title_id);
    
    if (titleIds.length === 0) {
      return [];
    }
    
    // Now fetch full data for these titles to construct the NormalizedSearchResult
    const results: SearchResult[] = [];
    
    // Prepared statements for data fetching
    const getFormatsStmt = db.prepare(`SELECT id, media_type FROM formats WHERE title_id = ?`);
    const getAltTitlesStmt = db.prepare(`SELECT alt_title FROM alternative_titles WHERE title_id = ? ORDER BY id ASC`);
    const getContributorsStmt = db.prepare(`
      SELECT c.name, fc.role
      FROM format_contributors fc
      JOIN contributors c ON fc.contributor_id = c.id
      WHERE fc.format_id = ?
    `);
    const getExtRefsStmt = db.prepare(`
      SELECT provider_id, provider_entity_id
      FROM external_references
      WHERE format_id = ?
    `);
    const getMetadataStmt = db.prepare(`SELECT synopsis FROM metadata WHERE title_id = ?`);
    const getGenresStmt = db.prepare(`
      SELECT g.name 
      FROM title_genres tg
      JOIN genres g ON tg.genre_id = g.id
      WHERE tg.title_id = ?
    `);

    for (const titleId of titleIds) {
      // 1. Titles and Alternatives
      const altTitleRows = getAltTitlesStmt.all(titleId) as { alt_title: string }[];
      if (altTitleRows.length === 0) {
        continue; // Should not happen, but safe guard
      }
      
      const primaryTitle = altTitleRows[0].alt_title;
      const alternativeTitles = altTitleRows.slice(1).map(r => r.alt_title);
      
      // 2. Formats
      const formatRows = getFormatsStmt.all(titleId) as { id: number, media_type: string }[];
      const formatTypes = formatRows.map(r => r.media_type.toUpperCase() as MediaType);
      
      // 3. Metadata
      const metadataRow = getMetadataStmt.get(titleId) as { synopsis: string } | undefined;
      const synopsis = metadataRow ? metadataRow.synopsis : null;
      
      // 4. Genres
      const genreRows = getGenresStmt.all(titleId) as { name: string }[];
      const genres = genreRows.map(r => r.name);
      
      // 5. Contributors and External References from all formats
      const contributorsMap = new Map<string, Contributor>();
      const providerReferences: ProviderReference[] = [];
      let isManualTitle = true;

      for (const format of formatRows) {
        // Contributors
        const contribRows = getContributorsStmt.all(format.id) as { name: string, role: string }[];
        for (const row of contribRows) {
          const key = `${row.name}|${row.role}`;
          if (!contributorsMap.has(key)) {
            contributorsMap.set(key, { name: row.name, role: row.role });
          }
        }
        
        // External Refs
        const extRefRows = getExtRefsStmt.all(format.id) as { provider_id: string, provider_entity_id: string }[];
        if (extRefRows.length > 0) {
          isManualTitle = false;
          for (const extRef of extRefRows) {
            // Avoid duplicates
            if (!providerReferences.find(pr => pr.providerId === extRef.provider_id && pr.providerEntityId === extRef.provider_entity_id)) {
               providerReferences.push({
                 providerId: extRef.provider_id as any, // Cast to ProviderId enum
                 providerEntityId: extRef.provider_entity_id
               });
            }
          }
        }
      }
      
      // Construct SearchResult
      results.push({
        titleId: titleId,
        libraryState: 'IN_LIBRARY',
        isManualTitle,
        title: primaryTitle,
        alternativeTitles,
        formats: [...new Set(formatTypes)], // unique formats
        poster: null, // We don't store poster in DB currently (relying on cache or external fetch in UI usually)
        synopsis,
        contributors: Array.from(contributorsMap.values()),
        genres,
        publicationInfo: null, // In Library search, we typically don't surface full publication info, or we could join publication_info
        availability: null, // Same here
        providerReferences
      });
    }
    
    return results;
  }
}
