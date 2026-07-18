import { Capability, MediaType, ProviderId } from '../models/provider.types';

export interface RouteTarget {
  primary: ProviderId;
  secondary: ProviderId | null;
}

export class CapabilityRouter {
  public static getRoute(capability: Capability, mediaType: MediaType): RouteTarget {
    const isAnime = mediaType === MediaType.ANIME;
    // Novels have no secondary. Comick (Manga/Manhwa/Manhua secondary) was rejected per ADR-015.
    const isNovel = mediaType === MediaType.NOVEL;

    switch (capability) {
      case Capability.SEARCH:
      case Capability.TITLE:
      case Capability.POSTER:
        // Poster is media-type aware. Anime primary is AniList, Manga/Novel primary is MangaUpdates.
        return isAnime
          ? { primary: ProviderId.ANILIST, secondary: ProviderId.JIKAN } // Anime search/title/poster
          : { primary: ProviderId.MANGAUPDATES, secondary: null }; // Manga/Novel search/title/poster has no secondary
      
      case Capability.ALTERNATIVE_TITLES:
      case Capability.PUBLICATION_INFO:
      case Capability.STORY_CONNECTIONS:
      case Capability.CONTRIBUTORS:
        return isAnime
          ? { primary: ProviderId.ANILIST, secondary: ProviderId.JIKAN }
          : { primary: ProviderId.MANGAUPDATES, secondary: isNovel ? null : ProviderId.ANILIST };

      case Capability.SYNOPSIS:
      case Capability.GENRES:
        return isAnime
          ? { primary: ProviderId.ANILIST, secondary: ProviderId.JIKAN }
          : { primary: ProviderId.MANGAUPDATES, secondary: isNovel ? null : ProviderId.ANILIST };

      case Capability.CHARACTERS:
      case Capability.STUDIOS:
        return isAnime
          ? { primary: ProviderId.ANILIST, secondary: null }
          : { primary: ProviderId.MANGAUPDATES, secondary: null }; // Typically MangaUpdates has some author/artist info under contributors, no studio/character specific for Manga

      case Capability.OFFICIAL_PUBLISHER:
      case Capability.OFFICIAL_PLATFORMS:
      case Capability.LICENSE_STATUS:
      case Capability.LATEST_OFFICIAL_RELEASE:
      case Capability.LATEST_SCANLATION_RELEASE:
      case Capability.SCANLATION_GROUPS:
      case Capability.HIATUS_STATUS:
        return isAnime
          ? { primary: ProviderId.ANILIST, secondary: null } // These are mostly manga concepts, but if asked for anime, AniList is primary
          : { primary: ProviderId.MANGAUPDATES, secondary: null };

      case Capability.AIRING_INFO:
      case Capability.TRAILERS:
        return isAnime
          ? { primary: ProviderId.ANILIST, secondary: ProviderId.JIKAN }
          : { primary: ProviderId.MANGAUPDATES, secondary: null };

      default:
        // Safe default fallback
        return isAnime
          ? { primary: ProviderId.ANILIST, secondary: ProviderId.JIKAN }
          : { primary: ProviderId.MANGAUPDATES, secondary: null };
    }
  }
}
