import { MediaType, ProviderId, ProviderSearchResult, ProviderMetadata } from '../models/provider.types';
import { ProviderClient } from './ProviderClient';
import { RateLimiter } from '../services/RateLimiter';
import { ProviderUrlGenerator } from '../services/ProviderUrlGenerator';

export class MangaUpdatesClient implements ProviderClient {
  public readonly providerId = ProviderId.MANGAUPDATES;
  private readonly baseUrl = 'https://api.mangaupdates.com/v1';
  private rateLimiter = new RateLimiter(2, 1000); // 2 req / second (conservative)

  public async search(query: string, mediaType: MediaType): Promise<ProviderSearchResult[]> {
    if (mediaType === MediaType.ANIME) return [];

    await this.rateLimiter.acquire();

    const url = `${this.baseUrl}/series/search`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ search: query, perpage: 25 })
    });

    if (!response.ok) {
      throw new Error(`MangaUpdates HTTP ${response.status}`);
    }

    const data = await response.json();
    return (data.results || []).map((m: any) => this.mapToSearchResult(m.record));
  }

  public async getMetadata(entityId: string): Promise<ProviderMetadata | null> {
    await this.rateLimiter.acquire();

    const url = `${this.baseUrl}/series/${entityId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`MangaUpdates HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data) return null;

    return this.mapToMetadata(data);
  }

  public getUrl(entityId: string): string {
    return ProviderUrlGenerator.generateProviderUrl(this.providerId, entityId);
  }

  private mapToSearchResult(m: any): ProviderSearchResult {
    const mainTitle = m.title || 'Unknown Title';
    const altTitles = (m.associated || []).map((a: any) => a.title);

    let format = MediaType.MANGA;
    if (m.type?.toLowerCase().includes('manhwa')) format = MediaType.MANHWA;
    if (m.type?.toLowerCase().includes('manhua')) format = MediaType.MANHUA;
    if (m.type?.toLowerCase().includes('novel')) format = MediaType.NOVEL;

    return {
      providerEntityId: String(m.series_id || m.id),
      title: mainTitle,
      alternativeTitles: altTitles,
      formats: [format],
      poster: m.image?.url?.original || null,
      synopsis: m.description || null,
      contributors: (m.authors || []).map((a: any) => ({ name: a.name, role: a.type })), 
      genres: (m.genres || []).map((g: any) => g.genre),
      publicationInfo: {
        status: m.status,
        startDate: m.year || null,
        endDate: null,
        chapterCount: null,
        volumeCount: null,
        episodeCount: null,
        officialPublisher: m.publishers?.find((p: any) => p.type === 'English')?.[0]?.publisher_name || null,
        licenseStatus: m.licensed ? 'Licensed' : 'Unlicensed'
      },
      availability: null
    };
  }

  private mapToMetadata(m: any): ProviderMetadata {
    const base = this.mapToSearchResult(m);
    
    return {
      ...base,
      characters: [],
      studios: [],
      storyConnections: m.related_series || [],
      airingInfo: null,
      trailers: [],
      hiatusStatus: null // Could be parsed from status if provided
    };
  }
}
