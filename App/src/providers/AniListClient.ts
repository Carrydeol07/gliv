import { MediaType, ProviderId, ProviderSearchResult, ProviderMetadata } from '../models/provider.types';
import { ProviderClient } from './ProviderClient';
import { RateLimiter } from '../services/RateLimiter';
import { ProviderUrlGenerator } from '../services/ProviderUrlGenerator';

export class AniListClient implements ProviderClient {
  public readonly providerId = ProviderId.ANILIST;
  private readonly baseUrl = 'https://graphql.anilist.co';
  private rateLimiter = new RateLimiter(90, 60000); // 90 req / min

  public async search(query: string, mediaType: MediaType): Promise<ProviderSearchResult[]> {
    if (mediaType !== MediaType.ANIME) return [];

    await this.rateLimiter.acquire();

    const graphqlQuery = `
      query ($search: String) {
        Page(page: 1, perPage: 25) {
          media(search: $search, type: ANIME) {
            id
            idMal
            title { romaji english native }
            description
            episodes
            status
            genres
            averageScore
            coverImage { large }
          }
        }
      }
    `;

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ query: graphqlQuery, variables: { search: query } })
    });

    if (!response.ok) {
      throw new Error(`AniList HTTP ${response.status}`);
    }

    const { data } = await response.json();
    return (data.Page.media || []).map((m: any) => this.mapToSearchResult(m));
  }

  public async getMetadata(entityId: string): Promise<ProviderMetadata | null> {
    await this.rateLimiter.acquire();

    const graphqlQuery = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          idMal
          title { romaji english native }
          description
          episodes
          status
          genres
          averageScore
          coverImage { large }
          characters(sort: FAVOURITES_DESC) {
            edges { node { name { full } } role }
          }
          staff {
            edges { node { name { full } } role }
          }
          studios {
            nodes { name isAnimationStudio }
          }
          airingSchedule {
            nodes { airingAt episode }
          }
          trailer { id site }
        }
      }
    `;

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ query: graphqlQuery, variables: { id: parseInt(entityId, 10) } })
    });

    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`AniList HTTP ${response.status}`);
    }

    const { data } = await response.json();
    if (!data || !data.Media) return null;
    return this.mapToMetadata(data.Media);
  }

  public getUrl(entityId: string): string {
    return ProviderUrlGenerator.generateProviderUrl(this.providerId, entityId);
  }

  private mapToSearchResult(m: any): ProviderSearchResult {
    const titles = [m.title?.english, m.title?.romaji, m.title?.native].filter(Boolean);
    const mainTitle = titles.length > 0 ? titles[0] : 'Unknown Title';
    const altTitles = titles.slice(1);

    return {
      providerEntityId: String(m.id),
      malId: m.idMal || null,
      title: mainTitle,
      alternativeTitles: altTitles,
      formats: [MediaType.ANIME],
      poster: m.coverImage?.large || null,
      synopsis: m.description || null,
      contributors: [], // Extracted in metadata full query
      genres: m.genres || [],
      publicationInfo: {
        status: m.status,
        startDate: null, endDate: null,
        chapterCount: null, volumeCount: null,
        episodeCount: m.episodes || null,
        officialPublisher: null, licenseStatus: null
      },
      availability: null
    };
  }

  private mapToMetadata(m: any): ProviderMetadata {
    const base = this.mapToSearchResult(m);
    
    return {
      ...base,
      characters: m.characters?.edges || [],
      studios: m.studios?.nodes || [],
      storyConnections: [], // Simplified for this example
      airingInfo: m.airingSchedule?.nodes || null,
      trailers: m.trailer ? [m.trailer] : [],
      hiatusStatus: null
    };
  }
}
