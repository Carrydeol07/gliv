import { NormalizedSearchResult } from '../../models/provider.types';

export enum ImportReviewAction {
  MERGE = 'MERGE',
  CREATE_NEW_TITLE = 'CREATE_NEW_TITLE',
  CREATE_MANUAL_TITLE = 'CREATE_MANUAL_TITLE',
  SEARCH_AGAIN = 'SEARCH_AGAIN',
  SKIP = 'SKIP'
}

export interface ProviderIdentityMatch {
  providerId: string;
  providerEntityId: string;
  confidence: number;
}

export interface LibraryDuplicateMatch {
  titleId: number;
  formatId?: number;
  confidence: number;
}

export interface ImportCandidate {
  importedData: NormalizedSearchResult;
  suggestedProviderMatch: ProviderIdentityMatch | null;
  existingLibraryMatch: LibraryDuplicateMatch | null;
  confidence: number;
  suggestedAction: ImportReviewAction;
}

export interface CommitPayload {
  candidate: ImportCandidate;
  action: ImportReviewAction;
  targetTitleId?: number; // Needed for MERGE
}
