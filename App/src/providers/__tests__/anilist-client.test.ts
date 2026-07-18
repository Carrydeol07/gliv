import { AniListClient } from '../AniListClient';
import { MediaType } from '../../models/provider.types';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('AniListClient', () => {
  let client: AniListClient;

  beforeEach(() => {
    client = new AniListClient();
    global.fetch = vi.fn();
  });

  it('searches anime and parses results', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { Page: { media: [{ id: 1, title: { romaji: 'Test' } }] } }
      })
    });

    const results = await client.search('Test', MediaType.ANIME);
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Test');
    expect(results[0].providerEntityId).toBe('1');
  });

  it('handles HTTP errors gracefully', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500
    });

    await expect(client.search('Test', MediaType.ANIME)).rejects.toThrow(/AniList HTTP 500/);
  });
});
