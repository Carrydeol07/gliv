import { CapabilityRouter } from '../CapabilityRouter';
import { MediaType, ProviderId, Capability } from '../../models/provider.types';
import { describe, it, expect } from 'vitest';

describe('CapabilityRouter', () => {

  // ─── SEARCH ───────────────────────────────────────────────
  describe('SEARCH routing', () => {
    it('Anime → AniList primary, Jikan secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.SEARCH, MediaType.ANIME);
      expect(route.primary).toBe(ProviderId.ANILIST);
      expect(route.secondary).toBe(ProviderId.JIKAN);
    });

    it('Manga → MangaUpdates primary, no secondary (Comick rejected)', () => {
      const route = CapabilityRouter.getRoute(Capability.SEARCH, MediaType.MANGA);
      expect(route.primary).toBe(ProviderId.MANGAUPDATES);
      expect(route.secondary).toBeNull();
    });

    it('Manhwa → MangaUpdates primary, no secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.SEARCH, MediaType.MANHWA);
      expect(route.primary).toBe(ProviderId.MANGAUPDATES);
      expect(route.secondary).toBeNull();
    });

    it('Manhua → MangaUpdates primary, no secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.SEARCH, MediaType.MANHUA);
      expect(route.primary).toBe(ProviderId.MANGAUPDATES);
      expect(route.secondary).toBeNull();
    });

    it('Novel → MangaUpdates primary, no secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.SEARCH, MediaType.NOVEL);
      expect(route.primary).toBe(ProviderId.MANGAUPDATES);
      expect(route.secondary).toBeNull();
    });
  });

  // ─── TITLE ────────────────────────────────────────────────
  describe('TITLE routing', () => {
    it('Anime → AniList primary, Jikan secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.TITLE, MediaType.ANIME);
      expect(route.primary).toBe(ProviderId.ANILIST);
      expect(route.secondary).toBe(ProviderId.JIKAN);
    });

    it('Manga → MangaUpdates primary, no secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.TITLE, MediaType.MANGA);
      expect(route.primary).toBe(ProviderId.MANGAUPDATES);
      expect(route.secondary).toBeNull();
    });

    it('Novel → MangaUpdates primary, no secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.TITLE, MediaType.NOVEL);
      expect(route.primary).toBe(ProviderId.MANGAUPDATES);
      expect(route.secondary).toBeNull();
    });
  });

  // ─── POSTER/COVER (media-type aware) ─────────────────────
  describe('POSTER routing (media-type aware)', () => {
    it('Anime → AniList primary, Jikan secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.POSTER, MediaType.ANIME);
      expect(route.primary).toBe(ProviderId.ANILIST);
      expect(route.secondary).toBe(ProviderId.JIKAN);
    });

    it('Manga → MangaUpdates primary, no secondary (Comick rejected)', () => {
      const route = CapabilityRouter.getRoute(Capability.POSTER, MediaType.MANGA);
      expect(route.primary).toBe(ProviderId.MANGAUPDATES);
      expect(route.secondary).toBeNull();
    });

    it('Manhwa → MangaUpdates primary, no secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.POSTER, MediaType.MANHWA);
      expect(route.primary).toBe(ProviderId.MANGAUPDATES);
      expect(route.secondary).toBeNull();
    });

    it('Novel → MangaUpdates primary, no secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.POSTER, MediaType.NOVEL);
      expect(route.primary).toBe(ProviderId.MANGAUPDATES);
      expect(route.secondary).toBeNull();
    });
  });

  // ─── SYNOPSIS ─────────────────────────────────────────────
  describe('SYNOPSIS routing', () => {
    it('Anime → AniList primary, Jikan secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.SYNOPSIS, MediaType.ANIME);
      expect(route.primary).toBe(ProviderId.ANILIST);
      expect(route.secondary).toBe(ProviderId.JIKAN);
    });

    it('Manga → MangaUpdates primary, AniList secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.SYNOPSIS, MediaType.MANGA);
      expect(route.primary).toBe(ProviderId.MANGAUPDATES);
      expect(route.secondary).toBe(ProviderId.ANILIST);
    });

    it('Novel → MangaUpdates primary, no secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.SYNOPSIS, MediaType.NOVEL);
      expect(route.primary).toBe(ProviderId.MANGAUPDATES);
      expect(route.secondary).toBeNull();
    });
  });

  // ─── GENRES ───────────────────────────────────────────────
  describe('GENRES routing', () => {
    it('Anime → AniList primary, Jikan secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.GENRES, MediaType.ANIME);
      expect(route.primary).toBe(ProviderId.ANILIST);
      expect(route.secondary).toBe(ProviderId.JIKAN);
    });

    it('Manga → MangaUpdates primary, AniList secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.GENRES, MediaType.MANGA);
      expect(route.primary).toBe(ProviderId.MANGAUPDATES);
      expect(route.secondary).toBe(ProviderId.ANILIST);
    });
  });

  // ─── CONTRIBUTORS ─────────────────────────────────────────
  describe('CONTRIBUTORS routing', () => {
    it('Anime → AniList primary, Jikan secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.CONTRIBUTORS, MediaType.ANIME);
      expect(route.primary).toBe(ProviderId.ANILIST);
      expect(route.secondary).toBe(ProviderId.JIKAN);
    });

    it('Manga → MangaUpdates primary, AniList secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.CONTRIBUTORS, MediaType.MANGA);
      expect(route.primary).toBe(ProviderId.MANGAUPDATES);
      expect(route.secondary).toBe(ProviderId.ANILIST);
    });

    it('Novel → MangaUpdates primary, no secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.CONTRIBUTORS, MediaType.NOVEL);
      expect(route.primary).toBe(ProviderId.MANGAUPDATES);
      expect(route.secondary).toBeNull();
    });
  });

  // ─── PUBLICATION_INFO ─────────────────────────────────────
  describe('PUBLICATION_INFO routing', () => {
    it('Anime → AniList primary', () => {
      const route = CapabilityRouter.getRoute(Capability.PUBLICATION_INFO, MediaType.ANIME);
      expect(route.primary).toBe(ProviderId.ANILIST);
    });

    it('Manga → MangaUpdates primary, AniList secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.PUBLICATION_INFO, MediaType.MANGA);
      expect(route.primary).toBe(ProviderId.MANGAUPDATES);
      expect(route.secondary).toBe(ProviderId.ANILIST);
    });
  });

  // ─── CHARACTERS ───────────────────────────────────────────
  describe('CHARACTERS routing', () => {
    it('Anime → AniList primary, no secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.CHARACTERS, MediaType.ANIME);
      expect(route.primary).toBe(ProviderId.ANILIST);
      expect(route.secondary).toBeNull();
    });

    it('Manga → MangaUpdates primary, no secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.CHARACTERS, MediaType.MANGA);
      expect(route.primary).toBe(ProviderId.MANGAUPDATES);
      expect(route.secondary).toBeNull();
    });
  });

  // ─── STUDIOS ──────────────────────────────────────────────
  describe('STUDIOS routing', () => {
    it('Anime → AniList primary, no secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.STUDIOS, MediaType.ANIME);
      expect(route.primary).toBe(ProviderId.ANILIST);
      expect(route.secondary).toBeNull();
    });
  });

  // ─── MANGA-SPECIFIC CAPABILITIES ─────────────────────────
  describe('Manga-specific capabilities', () => {
    it('OFFICIAL_PUBLISHER Manga → MangaUpdates, no secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.OFFICIAL_PUBLISHER, MediaType.MANGA);
      expect(route.primary).toBe(ProviderId.MANGAUPDATES);
      expect(route.secondary).toBeNull();
    });

    it('LICENSE_STATUS Manga → MangaUpdates, no secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.LICENSE_STATUS, MediaType.MANGA);
      expect(route.primary).toBe(ProviderId.MANGAUPDATES);
      expect(route.secondary).toBeNull();
    });

    it('LATEST_SCANLATION_RELEASE Manga → MangaUpdates, no secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.LATEST_SCANLATION_RELEASE, MediaType.MANGA);
      expect(route.primary).toBe(ProviderId.MANGAUPDATES);
      expect(route.secondary).toBeNull();
    });

    it('SCANLATION_GROUPS Manga → MangaUpdates, no secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.SCANLATION_GROUPS, MediaType.MANGA);
      expect(route.primary).toBe(ProviderId.MANGAUPDATES);
      expect(route.secondary).toBeNull();
    });

    it('HIATUS_STATUS Manga → MangaUpdates, no secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.HIATUS_STATUS, MediaType.MANGA);
      expect(route.primary).toBe(ProviderId.MANGAUPDATES);
      expect(route.secondary).toBeNull();
    });
  });

  // ─── ANIME-SPECIFIC CAPABILITIES ─────────────────────────
  describe('Anime-specific capabilities', () => {
    it('AIRING_INFO Anime → AniList primary, Jikan secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.AIRING_INFO, MediaType.ANIME);
      expect(route.primary).toBe(ProviderId.ANILIST);
      expect(route.secondary).toBe(ProviderId.JIKAN);
    });

    it('TRAILERS Anime → AniList primary, Jikan secondary', () => {
      const route = CapabilityRouter.getRoute(Capability.TRAILERS, MediaType.ANIME);
      expect(route.primary).toBe(ProviderId.ANILIST);
      expect(route.secondary).toBe(ProviderId.JIKAN);
    });
  });

  // ─── ADR-015: NO COMICK ANYWHERE ─────────────────────────
  describe('ADR-015 compliance: Comick never appears', () => {
    it('no capability × media type combination routes to comick', () => {
      const capabilities = Object.values(Capability);
      const mediaTypes = Object.values(MediaType);

      for (const cap of capabilities) {
        for (const mt of mediaTypes) {
          const route = CapabilityRouter.getRoute(cap, mt);
          expect(route.primary, `${cap}/${mt} primary`).not.toBe('comick');
          expect(route.secondary, `${cap}/${mt} secondary`).not.toBe('comick');
        }
      }
    });
  });
});
