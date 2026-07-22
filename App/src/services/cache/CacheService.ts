import { DatabaseService } from '../../database/DatabaseService';

export type CacheScope = 'library' | 'discover';

export interface CacheService {
  get<T>(key: string, scope: CacheScope): T | null;
  set<T>(key: string, value: T, ttlMs: number, scope: CacheScope, providerId: string, providerEntityId?: string, capability?: string): void;
  invalidate(key: string, scope: CacheScope): void;
  invalidateProvider(providerId: string, entityId: string): void;
  clear(scope?: CacheScope): void;
  markOrphaned(providerId: string, entityId: string): void;
  clearOrphaned(providerId: string, entityId: string): void;
}

export class SplitTierCacheService implements CacheService {
  private inMemoryCache: Map<string, { payload: string; expiresAt: number }> = new Map();

  constructor(private dbService: DatabaseService) {}

  public get<T>(key: string, scope: CacheScope): T | null {
    if (scope === 'discover') {
      const entry = this.inMemoryCache.get(key);
      if (!entry) return null;
      if (Date.now() > entry.expiresAt) {
        this.inMemoryCache.delete(key);
        return null;
      }
      return JSON.parse(entry.payload) as T;
    }

    if (scope === 'library') {
      const db = this.dbService.getDb();
      const row = db.prepare('SELECT payload, expires_at FROM cache_entries WHERE key = ?').get(key) as { payload: string; expires_at: number } | undefined;
      
      if (!row) return null;
      if (Date.now() > row.expires_at) {
        db.prepare('DELETE FROM cache_entries WHERE key = ?').run(key);
        return null;
      }
      
      return JSON.parse(row.payload) as T;
    }
    
    return null;
  }

  public set<T>(
    key: string, 
    value: T, 
    ttlMs: number, 
    scope: CacheScope, 
    providerId: string, 
    providerEntityId: string = '', 
    capability: string = ''
  ): void {
    const expiresAt = Date.now() + ttlMs;
    const payload = JSON.stringify(value);

    if (scope === 'discover') {
      this.inMemoryCache.set(key, { payload, expiresAt });
      return;
    }

    if (scope === 'library') {
      const db = this.dbService.getDb();
      db.prepare(`
        INSERT INTO cache_entries (key, provider_id, provider_entity_id, capability, payload, cached_at, expires_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET
          payload = excluded.payload,
          cached_at = excluded.cached_at,
          expires_at = excluded.expires_at,
          orphaned_at = NULL
      `).run(key, providerId, providerEntityId, capability, payload, Date.now(), expiresAt);
    }
  }

  public invalidate(key: string, scope: CacheScope): void {
    if (scope === 'discover') {
      this.inMemoryCache.delete(key);
    } else if (scope === 'library') {
      const db = this.dbService.getDb();
      db.prepare('DELETE FROM cache_entries WHERE key = ?').run(key);
    }
  }

  public invalidateProvider(providerId: string, entityId: string): void {
    // Library Tier
    const db = this.dbService.getDb();
    db.prepare('DELETE FROM cache_entries WHERE provider_id = ? AND provider_entity_id = ?').run(providerId, entityId);

    // Discover Tier
    // Since we don't index the discover tier, we have to iterate
    // This is fine since discover tier is in-memory and relatively small.
    // However, since Discover tier keys are just strings like "meta:anilist:123", we'll just check if key includes it.
    for (const key of this.inMemoryCache.keys()) {
      if (key.includes(providerId) && key.includes(entityId)) {
        this.inMemoryCache.delete(key);
      }
    }
  }

  public clear(scope?: CacheScope): void {
    if (!scope || scope === 'discover') {
      this.inMemoryCache.clear();
    }
    if (!scope || scope === 'library') {
      const db = this.dbService.getDb();
      db.prepare('DELETE FROM cache_entries').run();
    }
  }

  public markOrphaned(providerId: string, entityId: string): void {
    const db = this.dbService.getDb();
    db.prepare('UPDATE cache_entries SET orphaned_at = ? WHERE provider_id = ? AND provider_entity_id = ?')
      .run(Date.now(), providerId, entityId);
  }

  public clearOrphaned(providerId: string, entityId: string): void {
    const db = this.dbService.getDb();
    db.prepare('UPDATE cache_entries SET orphaned_at = NULL WHERE provider_id = ? AND provider_entity_id = ?')
      .run(providerId, entityId);
  }
}
