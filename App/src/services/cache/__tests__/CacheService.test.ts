import { DatabaseService } from '../../../database/DatabaseService';
import { SplitTierCacheService } from '../CacheService';
import { ProviderId } from '../../../models/provider.types';
import Database from 'better-sqlite3';
import { migration as initialSchema } from '../../../database/migrations/001_initial_schema';
import { migration as cacheEntries } from '../../../database/migrations/003_cache_entries';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

let dbService: DatabaseService;
let cacheService: SplitTierCacheService;
let db: Database.Database;

beforeEach(() => {
  dbService = new DatabaseService();
  dbService.initialize = function() {
    this.isInitialized = true;
    this.db = new Database(':memory:');
    this.db.pragma('foreign_keys = ON');
    
    // Run migrations
    this.db.exec(initialSchema.up);
    this.db.exec(cacheEntries.up);
  };

  dbService.initialize();
  db = dbService.getDb();
  cacheService = new SplitTierCacheService(dbService);
});

afterEach(() => {
  dbService.close();
});

describe('CacheService', () => {
  describe('Discover Tier (In-Memory)', () => {
    it('should set and get values within TTL', () => {
      cacheService.set('test_key', { data: 'value' }, 5000, 'discover', 'anilist');
      const result = cacheService.get<{ data: string }>('test_key', 'discover');
      expect(result).toEqual({ data: 'value' });
    });

    it('should return null for expired values and remove them', () => {
      vi.useFakeTimers();
      cacheService.set('test_key', { data: 'value' }, 1000, 'discover', 'anilist');
      
      vi.advanceTimersByTime(2000);
      
      const result = cacheService.get<{ data: string }>('test_key', 'discover');
      expect(result).toBeNull();
      vi.useRealTimers();
    });

    it('should invalidate specific key', () => {
      cacheService.set('test_key', { data: 'value' }, 5000, 'discover', 'anilist');
      cacheService.invalidate('test_key', 'discover');
      const result = cacheService.get('test_key', 'discover');
      expect(result).toBeNull();
    });

    it('should invalidate by provider', () => {
      cacheService.set('meta:anilist:123', { data: 'value' }, 5000, 'discover', 'anilist', '123');
      cacheService.invalidateProvider('anilist', '123');
      const result = cacheService.get('meta:anilist:123', 'discover');
      expect(result).toBeNull();
    });
  });

  describe('Library Tier (Database)', () => {
    it('should set and get values within TTL', () => {
      cacheService.set('test_key', { data: 'value' }, 5000, 'library', 'anilist', '123', 'search');
      
      const result = cacheService.get<{ data: string }>('test_key', 'library');
      expect(result).toEqual({ data: 'value' });
      
      const dbRow = db.prepare('SELECT * FROM cache_entries WHERE key = ?').get('test_key') as any;
      expect(dbRow).toBeDefined();
      expect(dbRow.provider_id).toBe('anilist');
      expect(dbRow.provider_entity_id).toBe('123');
      expect(dbRow.capability).toBe('search');
    });

    it('should update existing key on conflict', () => {
      cacheService.set('test_key', { data: 'value1' }, 5000, 'library', 'anilist');
      cacheService.set('test_key', { data: 'value2' }, 5000, 'library', 'anilist');
      
      const result = cacheService.get<{ data: string }>('test_key', 'library');
      expect(result).toEqual({ data: 'value2' });
      
      const count = db.prepare('SELECT COUNT(*) as c FROM cache_entries').get() as { c: number };
      expect(count.c).toBe(1);
    });

    it('should return null for expired values and remove them', () => {
      cacheService.set('test_key', { data: 'value' }, -1000, 'library', 'anilist');
      
      const result = cacheService.get<{ data: string }>('test_key', 'library');
      expect(result).toBeNull();
      
      const dbRow = db.prepare('SELECT * FROM cache_entries WHERE key = ?').get('test_key');
      expect(dbRow).toBeUndefined();
    });

    it('should invalidate specific key', () => {
      cacheService.set('test_key', { data: 'value' }, 5000, 'library', 'anilist');
      cacheService.invalidate('test_key', 'library');
      const result = cacheService.get('test_key', 'library');
      expect(result).toBeNull();
    });

    it('should invalidate by provider', () => {
      cacheService.set('test_key_1', { data: 'value1' }, 5000, 'library', 'anilist', '123');
      cacheService.set('test_key_2', { data: 'value2' }, 5000, 'library', 'anilist', '456');
      
      cacheService.invalidateProvider('anilist', '123');
      
      expect(cacheService.get('test_key_1', 'library')).toBeNull();
      expect(cacheService.get('test_key_2', 'library')).toEqual({ data: 'value2' });
    });

    it('should clear all cache entries', () => {
      cacheService.set('test_key_1', { data: 'value1' }, 5000, 'library', 'anilist');
      cacheService.clear('library');
      expect(cacheService.get('test_key_1', 'library')).toBeNull();
    });
    
    it('should mark and clear orphaned entries', () => {
      cacheService.set('test_key_1', { data: 'value1' }, 5000, 'library', 'anilist', '123');
      
      cacheService.markOrphaned('anilist', '123');
      let row = db.prepare('SELECT orphaned_at FROM cache_entries WHERE key = ?').get('test_key_1') as any;
      expect(row.orphaned_at).not.toBeNull();
      
      cacheService.clearOrphaned('anilist', '123');
      row = db.prepare('SELECT orphaned_at FROM cache_entries WHERE key = ?').get('test_key_1') as any;
      expect(row.orphaned_at).toBeNull();
    });
  });
});
