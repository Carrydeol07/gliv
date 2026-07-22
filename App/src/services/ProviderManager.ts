import { DatabaseService } from '../database/DatabaseService';
import { CapabilityRouter } from './CapabilityRouter';
import { CacheService, SplitTierCacheService, CacheScope } from './cache/CacheService';
import { ProviderUrlGenerator } from './ProviderUrlGenerator';
import { RetryHandler } from './RetryHandler';
import { ProviderClient } from '../providers/ProviderClient';
import { 
  Capability, 
  MediaType, 
  NormalizedSearchResult, 
  ProviderId, 
  ProviderMetadata, 
  ProviderReference, 
  ProviderSearchResult 
} from '../models/provider.types';
import { AniListClient } from '../providers/AniListClient';
import { JikanClient } from '../providers/JikanClient';
import { MangaUpdatesClient } from '../providers/MangaUpdatesClient';

export class ProviderManager {
  private cache: CacheService;
  private clients: Map<ProviderId, ProviderClient> = new Map();

  constructor(private dbService: DatabaseService) {
    this.cache = new SplitTierCacheService(dbService);
    this.clients.set(ProviderId.ANILIST, new AniListClient());
    this.clients.set(ProviderId.JIKAN, new JikanClient());
    this.clients.set(ProviderId.MANGAUPDATES, new MangaUpdatesClient());
  }

  public async search(query: string, mediaType: MediaType, scope: CacheScope): Promise<NormalizedSearchResult[]> {
    const route = CapabilityRouter.getRoute(Capability.SEARCH, mediaType);
    
    let primaryResults: ProviderSearchResult[] = [];
    let secondaryResults: ProviderSearchResult[] = [];
    
    const primaryClient = this.clients.get(route.primary);
    const isAnime = mediaType === MediaType.ANIME;
    const secondaryClient = route.secondary ? this.clients.get(route.secondary) : null;
    
    if (isAnime && primaryClient && secondaryClient) {
      // Concurrent fetching for Anime to support duplicate resolution without doubling latency
      const [primaryResult, secondaryResult] = await Promise.allSettled([
        (async () => {
          const start = Date.now();
          const res = await RetryHandler.withRetry(() => primaryClient.search(query, mediaType));
          this.logSyncHistory(route.primary, 'SUCCESS', Date.now() - start);
          return res;
        })(),
        (async () => {
          const start = Date.now();
          const res = await RetryHandler.withRetry(() => secondaryClient.search(query, mediaType));
          this.logSyncHistory(route.secondary!, 'SUCCESS', Date.now() - start);
          return res;
        })()
      ]);

      if (primaryResult.status === 'fulfilled') {
        primaryResults = primaryResult.value as ProviderSearchResult[];
        this.cache.set(`search:${mediaType}:${query}`, primaryResults, 3600000, scope, route.primary, '', Capability.SEARCH);
      } else {
        this.logSyncHistory(route.primary, 'FAILED', 0);
        const cached = this.cache.get<ProviderSearchResult[]>(`search:${mediaType}:${query}`, scope);
        if (cached) primaryResults = cached;
      }

      if (secondaryResult.status === 'fulfilled') {
        secondaryResults = secondaryResult.value as ProviderSearchResult[];
      } else {
        this.logSyncHistory(route.secondary!, 'FAILED', 0);
      }
    } else {
      // Sequential fallback for non-Anime
      if (primaryClient) {
        try {
          const start = Date.now();
          primaryResults = await RetryHandler.withRetry(() => primaryClient.search(query, mediaType));
          this.logSyncHistory(route.primary, 'SUCCESS', Date.now() - start);
          this.cache.set(`search:${mediaType}:${query}`, primaryResults, 3600000, scope, route.primary, '', Capability.SEARCH);
        } catch (error) {
          this.logSyncHistory(route.primary, 'FAILED', 0);
          const cached = this.cache.get<ProviderSearchResult[]>(`search:${mediaType}:${query}`, scope);
          if (cached) primaryResults = cached;
        }
      }

      if (secondaryClient && primaryResults.length === 0) {
        try {
          const start = Date.now();
          primaryResults = await RetryHandler.withRetry(() => secondaryClient.search(query, mediaType));
          this.logSyncHistory(route.secondary!, 'SUCCESS', Date.now() - start);
        } catch (error) {
          this.logSyncHistory(route.secondary!, 'FAILED', 0);
        }
      }
    }

    // Deduplication logic for Anime (MAL ID matching for AniList + Jikan)
    const normalized: NormalizedSearchResult[] = [];
    const malIdMap = new Map<number, NormalizedSearchResult>();
    const titleMap = new Map<string, NormalizedSearchResult>();

    // Process primary results
    for (const res of primaryResults) {
      const norm = this.normalizeSearchResult(res, route.primary);
      normalized.push(norm);
      if (isAnime) {
        if (norm.malId) malIdMap.set(norm.malId, norm);
        titleMap.set(norm.title.toLowerCase(), norm);
      }
    }

    // Process secondary results (dedup by MAL ID, fallback to title)
    for (const res of secondaryResults) {
      const norm = this.normalizeSearchResult(res, route.secondary!);
      
      let existing: NormalizedSearchResult | undefined;
      
      if (isAnime) {
        if (norm.malId && malIdMap.has(norm.malId)) {
          existing = malIdMap.get(norm.malId);
        } else if (titleMap.has(norm.title.toLowerCase())) {
          existing = titleMap.get(norm.title.toLowerCase());
        }
      } else {
         // Generic fallback for non-anime if secondary fetched overlapping data
         existing = titleMap.get(norm.title.toLowerCase());
      }
      
      if (existing) {
        // Merge provider references
        existing.providerReferences.push(norm.providerReferences[0]);
        if (!existing.poster && norm.poster) existing.poster = norm.poster;
      } else {
        normalized.push(norm);
        if (isAnime) {
          if (norm.malId) malIdMap.set(norm.malId, norm);
          titleMap.set(norm.title.toLowerCase(), norm);
        }
      }
    }
    
    return normalized;
  }

  public async getMetadata(providerId: ProviderId, entityId: string, scope: CacheScope): Promise<ProviderMetadata | null> {
    const client = this.clients.get(providerId);
    if (!client) return null;

    try {
      const start = Date.now();
      const metadata = await RetryHandler.withRetry(() => client.getMetadata(entityId));
      this.logSyncHistory(providerId, 'SUCCESS', Date.now() - start);
      
      if (metadata) {
        this.cache.set(`meta:${providerId}:${entityId}`, metadata, 86400000, scope, providerId, entityId, Capability.METADATA);
      }
      return metadata;
    } catch (error) {
      this.logSyncHistory(providerId, 'FAILED', 0);
      return this.cache.get<ProviderMetadata>(`meta:${providerId}:${entityId}`, scope);
    }
  }

  public getProviderUrl(providerId: ProviderId, entityId: string): string {
    return ProviderUrlGenerator.generateProviderUrl(providerId, entityId);
  }

  private normalizeSearchResult(res: ProviderSearchResult, providerId: ProviderId): NormalizedSearchResult {
    const refs: ProviderReference[] = [{ providerId, providerEntityId: res.providerEntityId }];
    
    return {
      malId: res.malId,
      title: res.title,
      alternativeTitles: res.alternativeTitles,
      formats: res.formats,
      poster: res.poster,
      synopsis: res.synopsis,
      contributors: res.contributors,
      genres: res.genres,
      publicationInfo: res.publicationInfo,
      availability: res.availability,
      providerReferences: refs
    };
  }

  private logSyncHistory(providerId: ProviderId, result: string, durationMs: number) {
    try {
      const db = this.dbService.getDb();
      db.prepare(
        'INSERT INTO sync_history (provider_id, result, duration_ms) VALUES (?, ?, ?)'
      ).run(providerId, result, durationMs);
    } catch (error) {
      console.error('Failed to write sync_history', error);
    }
  }
}
