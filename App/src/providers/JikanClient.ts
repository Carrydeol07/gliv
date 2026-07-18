import { MediaType, ProviderId, ProviderSearchResult, ProviderMetadata } from '../models/provider.types';
import { ProviderClient } from './ProviderClient';
import { RateLimiter } from '../services/RateLimiter';
import { ProviderUrlGenerator } from '../services/ProviderUrlGenerator';

export class JikanClient implements ProviderClient {
  public readonly providerId = ProviderId.JIKAN;
  private readonly baseUrl = 'https://api.jikan.moe/v4';
  private rateLimiter = new RateLimiter(3, 1000); // 3 req / second

  public async search(query: string, mediaType: MediaType): Promise<ProviderSearchResult[]> {
    if (mediaType !== MediaType.ANIME) return [];

    await this.rateLimiter.acquire();

    const url = new URL(`${this.baseUrl}/anime`);
    url.searchParams.append('q', query);
    url.searchParams.append('limit', '25');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Jikan HTTP ${response.status}`);
    }

    const { data } = await response.json();
    return (data || []).map((m: any) => this.mapToSearchResult(m));
  }

  public async getMetadata(entityId: string): Promise<ProviderMetadata | null> {
    await this.rateLimiter.acquire();

    const url = `${this.baseUrl}/anime/${entityId}/full`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`Jikan HTTP ${response.status}`);
    }

    const { data } = await response.json();
    if (!data) return null;

    // Optional: Fetch characters if needed, but sticking to /full for now
    return this.mapToMetadata(data);
  }

  public getUrl(entityId: string): string {
    return ProviderUrlGenerator.generateProviderUrl(this.providerId, entityId);
  }

  private mapToSearchResult(m: any): ProviderSearchResult {
    const mainTitle = m.title || 'Unknown Title';
    const altTitles = [m.title_english, m.title_japanese, ...(m.title_synonyms || [])].filter(Boolean);

    return {
      providerEntityId: String(m.mal_id),
      malId: m.mal_id || null,
      title: mainTitle,
      alternativeTitles: altTitles,
      formats: [MediaType.ANIME],
      poster: m.images?.jpg?.large_image_url || m.images?.jpg?.image_url || null,
      synopsis: m.synopsis || null,
      contributors: [], 
      genres: (m.genres || []).map((g: any) => g.name),
      publicationInfo: {
        status: m.status,
        startDate: m.aired?.from || null,
        endDate: m.aired?.to || null,
        chapterCount: null,
        volumeCount: null,
        episodeCount: m.episodes || null,
        officialPublisher: null,
        licenseStatus: null
      },
      availability: null
    };
  }

  private mapToMetadata(m: any): ProviderMetadata {
    const base = this.mapToSearchResult(m);
    
    return {
      ...base,
      characters: [], // Would require extra call or parsing relations
      studios: (m.studios || []).map((s: any) => ({ name: s.name, isAnimationStudio: true })),
      storyConnections: m.relations || [],
      airingInfo: m.broadcast ? [m.broadcast] : null,
      trailers: m.trailer?.url ? [{ id: m.trailer.youtube_id, site: 'youtube', url: m.trailer.url }] : [],
      hiatusStatus: null
    };
  }
}
