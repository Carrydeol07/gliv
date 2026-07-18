export enum MediaType {
  ANIME = 'ANIME',
  MANGA = 'MANGA',
  MANHWA = 'MANHWA',
  MANHUA = 'MANHUA',
  NOVEL = 'NOVEL'
}

export enum ProviderId {
  ANILIST = 'anilist',
  JIKAN = 'jikan',
  MANGAUPDATES = 'mangaupdates'
}

export enum Capability {
  SEARCH = 'SEARCH',
  TITLE = 'TITLE',
  ALTERNATIVE_TITLES = 'ALTERNATIVE_TITLES',
  SYNOPSIS = 'SYNOPSIS',
  POSTER = 'POSTER',
  CONTRIBUTORS = 'CONTRIBUTORS',
  GENRES = 'GENRES',
  CHARACTERS = 'CHARACTERS',
  STUDIOS = 'STUDIOS',
  PUBLICATION_INFO = 'PUBLICATION_INFO',
  STORY_CONNECTIONS = 'STORY_CONNECTIONS',
  OFFICIAL_PUBLISHER = 'OFFICIAL_PUBLISHER',
  OFFICIAL_PLATFORMS = 'OFFICIAL_PLATFORMS',
  LICENSE_STATUS = 'LICENSE_STATUS',
  LATEST_OFFICIAL_RELEASE = 'LATEST_OFFICIAL_RELEASE',
  LATEST_SCANLATION_RELEASE = 'LATEST_SCANLATION_RELEASE',
  SCANLATION_GROUPS = 'SCANLATION_GROUPS',
  HIATUS_STATUS = 'HIATUS_STATUS',
  AIRING_INFO = 'AIRING_INFO',
  TRAILERS = 'TRAILERS'
}

export interface Contributor {
  name: string;
  role: string;
}

export interface PublicationInfo {
  status: string | null;
  startDate: string | null;
  endDate: string | null;
  chapterCount: number | null;
  episodeCount: number | null;
  volumeCount: number | null;
  officialPublisher: string | null;
  licenseStatus: string | null;
}

export interface AvailabilityInfo {
  latestOfficialRelease: string | null;
  latestScanlationRelease: string | null;
  scanlationGroups: string[];
  officialPlatforms: string[];
}

export interface ProviderReference {
  providerId: ProviderId;
  providerEntityId: string;
}

export interface ProviderSearchResult {
  providerEntityId: string;
  malId?: number | null;
  title: string;
  alternativeTitles: string[];
  formats: MediaType[];
  poster: string | null;
  synopsis: string | null;
  contributors: Contributor[];
  genres: string[];
  publicationInfo: PublicationInfo | null;
  availability: AvailabilityInfo | null;
}

export interface ProviderMetadata extends ProviderSearchResult {
  characters: any[];
  studios: any[];
  storyConnections: any[];
  airingInfo: any | null;
  trailers: any[];
  hiatusStatus: string | null;
}

export interface NormalizedSearchResult {
  malId?: number | null;
  title: string;
  alternativeTitles: string[];
  formats: MediaType[];
  poster: string | null;
  synopsis: string | null;
  contributors: Contributor[];
  genres: string[];
  publicationInfo: PublicationInfo | null;
  availability: AvailabilityInfo | null;
  providerReferences: ProviderReference[];
}
