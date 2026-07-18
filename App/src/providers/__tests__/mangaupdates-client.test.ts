import { MangaUpdatesClient } from '../MangaUpdatesClient';
import { MediaType } from '../../models/provider.types';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('MangaUpdatesClient', () => {
  let client: MangaUpdatesClient;

  beforeEach(() => {
    client = new MangaUpdatesClient();
    global.fetch = vi.fn();
  });

  it('searches manga and parses results', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [{ record: { series_id: 123, title: 'Test Manga', type: 'Manga' } }]
      })
    });

    const results = await client.search('Test', MediaType.MANGA);
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Test Manga');
    expect(results[0].providerEntityId).toBe('123');
    expect(results[0].formats).toContain(MediaType.MANGA);
  });
});
