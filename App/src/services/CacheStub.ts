export interface CacheService {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  invalidate(key: string): void;
  clear(): void;
}

export class CacheStub implements CacheService {
  // Pass-through stub matching 46_CACHE_SYSTEM_SPECIFICATION.md interface
  // Real implementation will replace this in a future module
  
  public get<T>(_key: string): T | null {
    return null; // always a miss
  }

  public set<T>(_key: string, _value: T): void {
    // no-op
  }

  public invalidate(_key: string): void {
    // no-op
  }

  public clear(): void {
    // no-op
  }
}
