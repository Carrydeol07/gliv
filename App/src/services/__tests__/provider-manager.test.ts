import { ProviderManager } from '../ProviderManager';
import { DatabaseService } from '../../database/DatabaseService';
import { MediaType, ProviderId } from '../../models/provider.types';
import { RetryHandler } from '../RetryHandler';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock DB
const mockDb = {
  prepare: vi.fn().mockReturnThis(),
  run: vi.fn()
};
const mockDbService = {
  getDb: () => mockDb
} as unknown as DatabaseService;

// Mock RetryHandler to bypass backoff delays in tests
vi.spyOn(RetryHandler, 'withRetry').mockImplementation(async (op: any) => await op());

describe('ProviderManager', () => {
  let manager: ProviderManager;

  beforeEach(() => {
    manager = new ProviderManager(mockDbService);
    vi.clearAllMocks();
    // Re-apply after clearAllMocks
    vi.spyOn(RetryHandler, 'withRetry').mockImplementation(async (op: any) => await op());
  });

  // ─── GRACEFUL FAILURE ─────────────────────────────────────
  describe('graceful failure handling', () => {
    it('returns empty array on manga search when MangaUpdates fails', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
      const results = await manager.search('test', MediaType.MANGA);
      expect(results).toEqual([]);
    });

    it('returns empty array on novel search when MangaUpdates fails', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Timeout'));
      const results = await manager.search('test', MediaType.NOVEL);
      expect(results).toEqual([]);
    });

    it('returns null on metadata fetch failure', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
      const result = await manager.getMetadata(ProviderId.MANGAUPDATES, '123');
      expect(result).toBeNull();
    });

    it('logs failure to sync_history on primary failure', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
      await manager.search('test', MediaType.MANGA);
      expect(mockDb.prepare).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO sync_history')
      );
      expect(mockDb.run).toHaveBeenCalledWith('mangaupdates', 'FAILED', 0);
    });
  });

  // ─── SYNC HISTORY LOGGING ────────────────────────────────
  describe('sync_history logging', () => {
    it('logs SUCCESS with duration on successful search', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ results: [{ record: { series_id: 1, title: 'Test', type: 'Manga' } }] })
      });
      await manager.search('test', MediaType.MANGA);
      expect(mockDb.run).toHaveBeenCalledWith(
        'mangaupdates',
        'SUCCESS',
        expect.any(Number)
      );
    });
  });

  // ─── ANIME DEDUPLICATION ─────────────────────────────────
  describe('anime search deduplication', () => {
    it('merges AniList and Jikan results by MAL ID even if titles differ', async () => {
      let callCount = 0;
      global.fetch = vi.fn().mockImplementation(async (url: string) => {
        callCount++;
        // First call is AniList (POST to graphql.anilist.co)
        if (typeof url === 'string' && url.includes('anilist')) {
          return {
            ok: true,
            json: async () => ({
              data: { Page: { media: [
                { id: 100, idMal: 20, title: { romaji: 'Naruto (TV)', english: 'Naruto' }, genres: ['Action'] }
              ] } }
            })
          };
        }
        // Second call is Jikan (GET to api.jikan.moe)
        return {
          ok: true,
          json: async () => ({
            data: [
              { mal_id: 20, title: 'Naruto', genres: [{ name: 'Action' }] }
            ]
          })
        };
      });

      const results = await manager.search('Naruto', MediaType.ANIME);
      
      // Should be deduplicated to 1 result with 2 provider references because MAL ID (20) matched
      expect(results.length).toBe(1);
      expect(results[0].providerReferences.length).toBe(2);
      expect(results[0].providerReferences[0].providerId).toBe(ProviderId.ANILIST);
      expect(results[0].providerReferences[1].providerId).toBe(ProviderId.JIKAN);
    });

    it('keeps non-matching titles as separate results', async () => {
      global.fetch = vi.fn().mockImplementation(async (url: string) => {
        if (typeof url === 'string' && url.includes('anilist')) {
          return {
            ok: true,
            json: async () => ({
              data: { Page: { media: [
                { id: 100, title: { romaji: 'Naruto' } }
              ] } }
            })
          };
        }
        return {
          ok: true,
          json: async () => ({
            data: [
              { mal_id: 20, title: 'Boruto' }
            ]
          })
        };
      });

      const results = await manager.search('Naruto', MediaType.ANIME);
      expect(results.length).toBe(2);
    });
  });

  // ─── PROVIDER URL GENERATION ─────────────────────────────
  describe('provider URL generation', () => {
    it('delegates to ProviderUrlGenerator', () => {
      const url = manager.getProviderUrl(ProviderId.ANILIST, '12345');
      expect(url).toBe('https://anilist.co/anime/12345');
    });
  });
});
