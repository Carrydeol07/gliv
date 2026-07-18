import { JikanClient } from '../JikanClient';
import { MediaType } from '../../models/provider.types';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('JikanClient', () => {
  let client: JikanClient;

  beforeEach(() => {
    client = new JikanClient();
    global.fetch = vi.fn();
  });

  it('searches anime and parses results', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [{ mal_id: 1, title: 'Test' }]
      })
    });

    const results = await client.search('Test', MediaType.ANIME);
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Test');
    expect(results[0].providerEntityId).toBe('1');
  });
});
