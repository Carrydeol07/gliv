export type SortMode = 'Original Order' | 'Alphabetical' | 'Recently Added' | 'Recently Updated' | 'Personal Rating';

export interface LibraryFilterParams {
  mediaType?: string; // e.g., 'Anime', 'Manga'
  status?: string; // 'Reading', 'Watching', 'Completed', 'Paused', 'Dropped'
  genre?: string;
  contributor?: string;
  collectionId?: number;
  personalTagId?: number;
  minRating?: number;
  favoritesOnly?: boolean;
}

export interface LibraryFormatData {
  id: number;
  mediaType: string;
  progressUnit: string;
  personalProgress: number;
  status: string;
  progressOverride: number | null;
  isManual: boolean;
  effectiveLatest?: number;
}

export interface LibraryTitleData {
  id: number;
  displayTitle: string;
  primaryContributor: string | null;
  rating: number | null;
  favorite: boolean;
  originalOrder: number;
  notes: string | null;
  formats: LibraryFormatData[];
  genres: string[];
  personalTags: string[];
  collections: number[];
}
