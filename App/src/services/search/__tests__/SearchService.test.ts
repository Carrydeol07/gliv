import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { SearchService } from '../SearchService';
import { ProviderManager } from '../../ProviderManager';
import { DatabaseService } from '../../../database/DatabaseService';
import { MediaType, ProviderId } from '../../../models/provider.types';
import { CacheScope } from '../../cache/CacheService';
import { SearchState } from '../types';

// Mock dependencies
vi.mock('../../../database/DatabaseService');
vi.mock('../../ProviderManager');
vi.mock('../LibrarySearchRepository');

import { LibrarySearchRepository } from '../LibrarySearchRepository';

describe('SearchService', () => {
  let searchService: SearchService;
  let mockDbService: DatabaseService;
  let mockProviderManager: ProviderManager;
  let mockLibraryRepo: LibrarySearchRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockDbService = new DatabaseService();
    mockProviderManager = new ProviderManager(mockDbService);
    
    // We instantiate SearchService with mocked dependencies
    searchService = new SearchService(mockDbService, mockProviderManager);
    
    // Override the internally created repo with a mock
    mockLibraryRepo = new LibrarySearchRepository(mockDbService);
    (searchService as any).libraryRepo = mockLibraryRepo;
  });

  const createProviderResult = (title: string, altTitles: string[] = [], providerEntityId = '123') => ({
    title,
    alternativeTitles: altTitles,
    formats: [MediaType.ANIME],
    poster: null,
    synopsis: null,
    contributors: [],
    genres: [],
    publicationInfo: null,
    availability: null,
    providerReferences: [{ providerId: ProviderId.ANILIST, providerEntityId }]
  });

  const createLibraryResult = (titleId: number, title: string, altTitles: string[] = [], providerEntityId = '123', isManual = false) => ({
    titleId,
    libraryState: 'IN_LIBRARY' as const,
    isManualTitle: isManual,
    title,
    alternativeTitles: altTitles,
    formats: [MediaType.ANIME],
    poster: null,
    synopsis: null,
    contributors: [],
    genres: [],
    publicationInfo: null,
    availability: null,
    providerReferences: isManual ? [] : [{ providerId: ProviderId.ANILIST, providerEntityId }]
  });

  it('should return IN_LIBRARY when query matches an existing library title', async () => {
    const libraryRes = createLibraryResult(1, 'Naruto', [], '123');
    const providerRes = createProviderResult('Naruto', [], '123');

    vi.mocked(mockLibraryRepo.search).mockReturnValue([libraryRes]);
    vi.mocked(mockProviderManager.search).mockResolvedValue([providerRes]);

    const res = await searchService.search('Naruto', MediaType.ANIME, 'discover' as CacheScope);
    
    expect(res.state).toBe(SearchState.RESULTS);
    expect(res.results).toHaveLength(1); // Merged deduplicated
    expect(res.results[0].libraryState).toBe('IN_LIBRARY');
    expect(res.results[0].titleId).toBe(1);
  });

  it('should return NOT_IN_LIBRARY when query matches a new provider entity', async () => {
    const providerRes = createProviderResult('One Piece', [], '999');

    vi.mocked(mockLibraryRepo.search).mockReturnValue([]);
    vi.mocked(mockProviderManager.search).mockResolvedValue([providerRes]);

    const res = await searchService.search('One Piece', MediaType.ANIME, 'discover' as CacheScope);
    
    expect(res.state).toBe(SearchState.RESULTS);
    expect(res.results).toHaveLength(1);
    expect(res.results[0].libraryState).toBe('NOT_IN_LIBRARY');
    expect(res.results[0].titleId).toBeUndefined();
  });

  it('should successfully surface a Manual Title from the local repository', async () => {
    const manualRes = createLibraryResult(2, 'My Custom Fanfic', [], '', true);

    vi.mocked(mockLibraryRepo.search).mockReturnValue([manualRes]);
    vi.mocked(mockProviderManager.search).mockResolvedValue([]);

    const res = await searchService.search('Custom', MediaType.ANIME, 'discover' as CacheScope);
    
    expect(res.state).toBe(SearchState.RESULTS);
    expect(res.results).toHaveLength(1);
    expect(res.results[0].isManualTitle).toBe(true);
    expect(res.results[0].libraryState).toBe('IN_LIBRARY');
  });

  it('should not create duplicate cards if a provider result already has an external_reference in library matches', async () => {
    // Both return the same item
    const libraryRes = createLibraryResult(3, 'Bleach', [], '456');
    const providerRes = createProviderResult('Bleach', [], '456');

    vi.mocked(mockLibraryRepo.search).mockReturnValue([libraryRes]);
    vi.mocked(mockProviderManager.search).mockResolvedValue([providerRes]);

    const res = await searchService.search('Bleach', MediaType.ANIME, 'discover' as CacheScope);
    
    expect(res.results).toHaveLength(1);
    expect(res.results[0].title).toBe('Bleach');
    expect(res.results[0].libraryState).toBe('IN_LIBRARY');
  });

  it('should rank provider results above all Library matches for scope: discover - including edge case of library exact match vs provider alt-title match', async () => {
    // Library has exact match for 'Attack on Titan'
    const libraryRes = createLibraryResult(4, 'Attack on Titan', [], '111');
    
    // Provider returns a fuzzy/alt-title match for a DIFFERENT title (say a spin-off) that is NOT in library
    const providerRes = createProviderResult('Shingeki no Kyojin: Spin-off', ['Attack on Titan Spin-off'], '222');

    vi.mocked(mockLibraryRepo.search).mockReturnValue([libraryRes]);
    vi.mocked(mockProviderManager.search).mockResolvedValue([providerRes]);

    const res = await searchService.search('Attack on Titan', MediaType.ANIME, 'discover' as CacheScope);
    
    expect(res.results).toHaveLength(2);
    
    // Provider result MUST rank first even if its score (alt title match) is worse than library exact match
    expect(res.results[0].title).toBe('Shingeki no Kyojin: Spin-off');
    expect(res.results[0].libraryState).toBe('NOT_IN_LIBRARY');

    // Library exact match appears below
    expect(res.results[1].title).toBe('Attack on Titan');
    expect(res.results[1].libraryState).toBe('IN_LIBRARY');
  });

  it('should gracefully handle provider failures and still return library matches', async () => {
    const libraryRes = createLibraryResult(5, 'Death Note', [], '333');

    vi.mocked(mockLibraryRepo.search).mockReturnValue([libraryRes]);
    vi.mocked(mockProviderManager.search).mockRejectedValue(new Error('Network offline'));

    const res = await searchService.search('Death Note', MediaType.ANIME, 'discover' as CacheScope);
    
    // Returns results successfully (the library match) but flags provider unavailable
    expect(res.state).toBe(SearchState.RESULTS);
    expect(res.results).toHaveLength(1);
    expect(res.results[0].title).toBe('Death Note');
  });

  it('should return PROVIDER_UNAVAILABLE when provider fails and there are no library matches', async () => {
    vi.mocked(mockLibraryRepo.search).mockReturnValue([]);
    vi.mocked(mockProviderManager.search).mockRejectedValue(new Error('Network offline'));

    const res = await searchService.search('Unknown', MediaType.ANIME, 'discover' as CacheScope);
    
    expect(res.state).toBe(SearchState.PROVIDER_UNAVAILABLE);
    expect(res.results).toHaveLength(0);
  });

  it('should thread scope correctly to ProviderManager', async () => {
    vi.mocked(mockLibraryRepo.search).mockReturnValue([]);
    vi.mocked(mockProviderManager.search).mockResolvedValue([]);

    await searchService.search('Test', MediaType.ANIME, 'discover' as CacheScope);
    
    expect(mockProviderManager.search).toHaveBeenCalledWith('Test', MediaType.ANIME, 'discover');
  });
});
