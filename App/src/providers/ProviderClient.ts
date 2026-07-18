import { MediaType, ProviderId, ProviderSearchResult, ProviderMetadata } from '../models/provider.types';

export interface ProviderClient {
  readonly providerId: ProviderId;
  search(query: string, mediaType: MediaType): Promise<ProviderSearchResult[]>;
  getMetadata(entityId: string): Promise<ProviderMetadata | null>;
  getUrl(entityId: string): string;
}
