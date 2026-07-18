import { ProviderId } from '../models/provider.types';

export class ProviderUrlGenerator {
  public static generateProviderUrl(providerId: ProviderId, entityId: string): string {
    switch (providerId) {
      case ProviderId.ANILIST:
        return `https://anilist.co/anime/${entityId}`;
      case ProviderId.JIKAN:
        return `https://myanimelist.net/anime/${entityId}`;
      case ProviderId.MANGAUPDATES:
        return `https://www.mangaupdates.com/series/${entityId}`;
      default:
        throw new Error(`Unsupported provider: ${providerId}`);
    }
  }
}
