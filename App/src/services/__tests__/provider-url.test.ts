import { ProviderUrlGenerator } from '../ProviderUrlGenerator';
import { ProviderId } from '../../models/provider.types';
import { describe, it, expect } from 'vitest';

describe('ProviderUrlGenerator', () => {
  it('generates AniList URL', () => {
    const url = ProviderUrlGenerator.generateProviderUrl(ProviderId.ANILIST, '12345');
    expect(url).toBe('https://anilist.co/anime/12345');
  });

  it('generates Jikan URL (MAL)', () => {
    const url = ProviderUrlGenerator.generateProviderUrl(ProviderId.JIKAN, '54321');
    expect(url).toBe('https://myanimelist.net/anime/54321');
  });

  it('generates MangaUpdates URL', () => {
    const url = ProviderUrlGenerator.generateProviderUrl(ProviderId.MANGAUPDATES, '98765');
    expect(url).toBe('https://www.mangaupdates.com/series/98765');
  });

  it('throws on unknown provider', () => {
    expect(() => ProviderUrlGenerator.generateProviderUrl('unknown' as ProviderId, '1')).toThrow();
  });
});
