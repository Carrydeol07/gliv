import { DatabaseService } from '../../database/DatabaseService';
import { EffectiveLatestCalculator } from './EffectiveLatestCalculator';
import { SortMode, LibraryFilterParams, LibraryTitleData, LibraryFormatData } from './types';

export class LibraryRepository {
  constructor(private dbService: DatabaseService) {}

  public getLibrary(sort: SortMode, filters: LibraryFilterParams, searchString?: string): LibraryTitleData[] {
    const db = this.dbService.getDb();
    
    let sql = `
      SELECT DISTINCT t.id as title_id
      FROM titles t
    `;
    
    // Join necessary tables for filtering/searching
    const needsFormat = filters.mediaType || filters.status;
    const needsAltTitles = searchString;
    const needsContributors = filters.contributor || searchString;
    const needsGenres = filters.genre;
    const needsPersonalTags = filters.personalTagId;
    const needsCollections = filters.collectionId;
    
    if (needsFormat) sql += ` LEFT JOIN formats f ON t.id = f.title_id`;
    if (needsAltTitles) sql += ` LEFT JOIN alternative_titles at ON t.id = at.title_id`;
    if (needsContributors) sql += ` LEFT JOIN formats f2 ON t.id = f2.title_id LEFT JOIN format_contributors fc ON f2.id = fc.format_id LEFT JOIN contributors c ON fc.contributor_id = c.id`;
    if (needsGenres) sql += ` LEFT JOIN title_genres tg ON t.id = tg.title_id LEFT JOIN genres g ON tg.genre_id = g.id`;
    if (needsPersonalTags) sql += ` LEFT JOIN title_personal_tags tpt ON t.id = tpt.title_id`;
    if (needsCollections) sql += ` LEFT JOIN collection_items ci ON t.id = ci.title_id`;

    const conditions: string[] = [];
    const params: any[] = [];
    
    if (searchString) {
      const like = `%${searchString}%`;
      conditions.push(`(at.alt_title LIKE ? OR c.name LIKE ?)`);
      params.push(like, like);
    }
    
    if (filters.mediaType) {
      conditions.push(`f.media_type = ?`);
      params.push(filters.mediaType);
    }
    
    if (filters.status) {
      conditions.push(`f.status = ?`);
      params.push(filters.status);
    }
    
    if (filters.genre) {
      conditions.push(`g.name = ?`);
      params.push(filters.genre);
    }
    
    if (filters.contributor) {
      conditions.push(`c.name = ?`);
      params.push(filters.contributor);
    }
    
    if (filters.collectionId) {
      conditions.push(`ci.collection_id = ?`);
      params.push(filters.collectionId);
    }
    
    if (filters.personalTagId) {
      conditions.push(`tpt.personal_tag_id = ?`);
      params.push(filters.personalTagId);
    }
    
    if (filters.minRating) {
      conditions.push(`t.rating >= ?`);
      params.push(filters.minRating);
    }
    
    if (filters.favoritesOnly) {
      conditions.push(`t.favorite = 1`);
    }
    
    if (conditions.length > 0) {
      sql += ` WHERE ` + conditions.join(' AND ');
    }
    
    const matchingRows = db.prepare(sql).all(...params) as { title_id: number }[];
    const titleIds = matchingRows.map(r => r.title_id);
    
    if (titleIds.length === 0) return [];

    // Fetch full data for matching titles
    const results: LibraryTitleData[] = [];
    
    const getTitleStmt = db.prepare(`SELECT * FROM titles WHERE id = ?`);
    const getNotesStmt = db.prepare(`SELECT content FROM notes WHERE title_id = ?`);
    const getFormatsStmt = db.prepare(`SELECT * FROM formats WHERE title_id = ?`);
    const getAltTitlesStmt = db.prepare(`SELECT alt_title FROM alternative_titles WHERE title_id = ? ORDER BY id ASC`);
    const getContributorsStmt = db.prepare(`
      SELECT c.name, fc.role
      FROM format_contributors fc
      JOIN contributors c ON fc.contributor_id = c.id
      WHERE fc.format_id = ?
    `);
    const getPubInfoStmt = db.prepare(`SELECT * FROM publication_info WHERE format_id = ?`);
    const getExtRefsStmt = db.prepare(`SELECT provider_id FROM external_references WHERE format_id = ?`);
    const getGenresStmt = db.prepare(`
      SELECT g.name FROM title_genres tg JOIN genres g ON tg.genre_id = g.id WHERE tg.title_id = ?
    `);
    const getPersonalTagsStmt = db.prepare(`
      SELECT pt.name FROM title_personal_tags tpt JOIN personal_tags pt ON tpt.personal_tag_id = pt.id WHERE tpt.title_id = ?
    `);
    const getCollectionsStmt = db.prepare(`SELECT collection_id FROM collection_items WHERE title_id = ?`);
    const getLatestEditStmt = db.prepare(`
      SELECT MAX(edit_time) as last_edit 
      FROM edit_history 
      WHERE (entity_type = 'TITLE' AND entity_id = ?) OR (entity_type = 'FORMAT' AND entity_id IN (SELECT id FROM formats WHERE title_id = ?))
    `);

    // We will attach lastEditTime for "Recently Updated" sort
    const titlesWithSortMetadata: { data: LibraryTitleData; lastEditTime: number; createdAt: number }[] = [];

    for (const titleId of titleIds) {
      const titleRow = getTitleStmt.get(titleId) as any;
      const notesRow = getNotesStmt.get(titleId) as { content: string } | undefined;
      const altTitles = getAltTitlesStmt.all(titleId) as { alt_title: string }[];
      const displayTitle = altTitles.length > 0 ? altTitles[0].alt_title : 'Unknown Title';
      
      const formatRows = getFormatsStmt.all(titleId) as any[];
      const formatsData: LibraryFormatData[] = [];
      let primaryContributor: string | null = null;
      
      for (const format of formatRows) {
        const extRefs = getExtRefsStmt.all(format.id) as any[];
        const isManual = extRefs.length === 0;
        let effectiveLatest: number | undefined;
        
        if (!isManual) {
          const pubInfo = getPubInfoStmt.get(format.id) as any;
          effectiveLatest = EffectiveLatestCalculator.calculate(
            pubInfo?.latest_official_release,
            pubInfo?.latest_scanlation_release,
            format.progress_override
          );
        }
        
        formatsData.push({
          id: format.id,
          mediaType: format.media_type,
          progressUnit: format.progress_unit,
          personalProgress: format.personal_progress,
          status: format.status,
          progressOverride: format.progress_override,
          isManual,
          effectiveLatest
        });

        if (!primaryContributor) {
          const contribs = getContributorsStmt.all(format.id) as any[];
          if (contribs.length > 0) {
            primaryContributor = contribs[0].name;
          }
        }
      }

      const genres = (getGenresStmt.all(titleId) as any[]).map(g => g.name);
      const personalTags = (getPersonalTagsStmt.all(titleId) as any[]).map(pt => pt.name);
      const collections = (getCollectionsStmt.all(titleId) as any[]).map(c => c.collection_id);

      const libraryTitle: LibraryTitleData = {
        id: titleRow.id,
        displayTitle,
        primaryContributor,
        rating: titleRow.rating,
        favorite: Boolean(titleRow.favorite),
        originalOrder: titleRow.original_order,
        notes: notesRow?.content || null,
        formats: formatsData,
        genres,
        personalTags,
        collections
      };

      const lastEditRow = getLatestEditStmt.get(titleId, titleId) as { last_edit: string | null };
      const lastEditTime = lastEditRow.last_edit ? new Date(lastEditRow.last_edit).getTime() : 0;
      const createdAtTime = titleRow.created_at ? new Date(titleRow.created_at).getTime() : 0;

      titlesWithSortMetadata.push({
        data: libraryTitle,
        lastEditTime,
        createdAt: createdAtTime
      });
    }

    // Sort in memory
    titlesWithSortMetadata.sort((a, b) => {
      switch (sort) {
        case 'Original Order':
          return a.data.originalOrder - b.data.originalOrder;
        case 'Alphabetical':
          return a.data.displayTitle.localeCompare(b.data.displayTitle);
        case 'Recently Added':
          return b.data.originalOrder - a.data.originalOrder; // original order determines sequence
        case 'Recently Updated':
          return b.lastEditTime - a.lastEditTime;
        case 'Personal Rating':
          const ratingA = a.data.rating ?? -1;
          const ratingB = b.data.rating ?? -1;
          if (ratingA !== ratingB) return ratingB - ratingA;
          return a.data.originalOrder - b.data.originalOrder;
        default:
          return a.data.originalOrder - b.data.originalOrder;
      }
    });

    return titlesWithSortMetadata.map(t => t.data);
  }
}
