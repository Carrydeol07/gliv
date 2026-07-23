import { NormalizedSearchResult, MediaType, ProviderReference } from '../../models/provider.types';

/**
 * Library state flags for a search result.
 * ALREADY_PLANNED is explicitly deferred pending Collections module.
 */
export type LibraryState = 'IN_LIBRARY' | 'NOT_IN_LIBRARY';

/**
 * The normalized search result extended with local library state.
 */
export interface SearchResult extends NormalizedSearchResult {
  libraryState: LibraryState;
  
  /**
   * The local database Title ID if this result is IN_LIBRARY.
   */
  titleId?: number;
  
  /**
   * True if this is a Manual Title that has no provider mapping.
   */
  isManualTitle?: boolean;
}

export enum SearchState {
  EMPTY = 'EMPTY',
  SEARCHING = 'SEARCHING',
  RESULTS = 'RESULTS',
  NO_RESULTS = 'NO_RESULTS',
  OFFLINE = 'OFFLINE',
  PROVIDER_UNAVAILABLE = 'PROVIDER_UNAVAILABLE'
}

export interface SearchResponse {
  state: SearchState;
  results: SearchResult[];
}
