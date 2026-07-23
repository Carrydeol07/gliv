import { ProviderManager } from '../ProviderManager';
import { CacheScope } from '../cache/CacheService';
import { MediaType, NormalizedSearchResult } from '../../models/provider.types';
import { SearchResult, SearchState, SearchResponse } from './types';
import { LibrarySearchRepository } from './LibrarySearchRepository';
import { DatabaseService } from '../../database/DatabaseService';

export class SearchService {
  private libraryRepo: LibrarySearchRepository;

  constructor(
    private dbService: DatabaseService,
    private providerManager: ProviderManager
  ) {
    this.libraryRepo = new LibrarySearchRepository(dbService);
  }

  public async search(query: string, mediaType: MediaType, scope: CacheScope): Promise<SearchResponse> {
    if (!query || query.trim().length === 0) {
      return { state: SearchState.EMPTY, results: [] };
    }

    let providerResults: NormalizedSearchResult[] = [];
    let providerState: SearchState = SearchState.SEARCHING;

    try {
      // Execute local and provider searches concurrently
      const [localResults, fetchedProviderResults] = await Promise.allSettled([
        (async () => this.libraryRepo.search(query, mediaType))(),
        (async () => this.providerManager.search(query, mediaType, scope))()
      ]);

      let libraryMatches = localResults.status === 'fulfilled' ? localResults.value : [];
      
      if (fetchedProviderResults.status === 'fulfilled') {
        providerResults = fetchedProviderResults.value;
      } else {
        // Provider search failed - gracefully fall back to local only
        providerState = SearchState.PROVIDER_UNAVAILABLE;
        console.error('Provider search failed:', fetchedProviderResults.reason);
      }

      // Merge and Library State Detection
      const mergedResults = this.mergeAndRank(query, libraryMatches, providerResults, scope);

      let finalState = providerState;
      if (mergedResults.length > 0) {
        finalState = SearchState.RESULTS;
      } else if (providerState !== SearchState.PROVIDER_UNAVAILABLE) {
        finalState = SearchState.NO_RESULTS;
      }

      return {
        state: finalState,
        results: mergedResults
      };

    } catch (err) {
      console.error('Search orchestration error:', err);
      // In worst case, if orchestration fails, return offline/unavailable
      return { state: SearchState.PROVIDER_UNAVAILABLE, results: [] };
    }
  }

  private mergeAndRank(
    query: string, 
    libraryMatches: SearchResult[], 
    providerResults: NormalizedSearchResult[], 
    scope: CacheScope
  ): SearchResult[] {
    const q = query.toLowerCase();

    // Helper to score a result for the 4-tier internal ordering:
    // 1 (Highest) - Exact Match (Primary Title)
    // 2 - Alternative Titles Match
    // 3 - Native Titles (often just alt titles in our schema)
    // 4 - Contributor Match
    const getScore = (res: NormalizedSearchResult): number => {
      if (res.title.toLowerCase() === q) return 1;
      
      const altMatch = res.alternativeTitles.find(t => t.toLowerCase() === q);
      if (altMatch) return 2;
      
      // Basic substring match fallback if not exact
      if (res.title.toLowerCase().includes(q)) return 1.5; 
      if (res.alternativeTitles.some(t => t.toLowerCase().includes(q))) return 2.5;

      const contribMatch = res.contributors.some(c => c.name.toLowerCase().includes(q));
      if (contribMatch) return 4;

      return 5; // Catch-all
    };

    // 1. Process provider results to attach libraryState
    // To do this, we need to check if any of their external references match an existing format in the library.
    const mappedProviderResults: SearchResult[] = providerResults.map(pr => {
      // We check if this provider result already exists in the library Matches
      // The most reliable way is comparing provider references.
      let matchingLibraryItem = libraryMatches.find(lm => {
        return lm.providerReferences.some(lmRef => 
          pr.providerReferences.some(prRef => 
            prRef.providerId === lmRef.providerId && prRef.providerEntityId === lmRef.providerEntityId
          )
        );
      });

      return {
        ...pr,
        libraryState: matchingLibraryItem ? 'IN_LIBRARY' : 'NOT_IN_LIBRARY',
        titleId: matchingLibraryItem?.titleId,
        isManualTitle: false // Provider results are never manual
      };
    });

    // We also need to extract Library items that were NOT found in the provider results.
    // e.g. Manual Titles, or titles from providers that failed to return them this time.
    const uniqueLibraryMatches = libraryMatches.filter(lm => {
      return !mappedProviderResults.some(mpr => 
        mpr.providerReferences.some(mprRef => 
          lm.providerReferences.some(lmRef => 
            lmRef.providerId === mprRef.providerId && lmRef.providerEntityId === mprRef.providerEntityId
          )
        )
      );
    });

    // 2. Sort both lists internally
    const sortedProvider = mappedProviderResults.sort((a, b) => getScore(a) - getScore(b));
    const sortedLibrary = uniqueLibraryMatches.sort((a, b) => getScore(a) - getScore(b));

    // 3. Rank per scope
    if (scope === 'discover') {
      // In Discover, Provider results always rank above Library matches
      return [...sortedProvider, ...sortedLibrary];
    } else {
      // Fallback/Legacy/Library scope behavior if requested
      // For pure library scope, it would likely be library first.
      return [...sortedLibrary, ...sortedProvider];
    }
  }
}
