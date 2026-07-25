import { ProgressService } from '../ProgressService';
import { DatabaseService } from '../../../database/DatabaseService';

// Mock DB Service
const mockDbService = new DatabaseService();
const progressService = new ProgressService(mockDbService);

describe('ProgressService', () => {
  describe('calculateEffectiveLatest', () => {
    it('should return undefined when all inputs are null/undefined', () => {
      expect(progressService.calculateEffectiveLatest(null, null, null)).toBeUndefined();
    });

    it('should return the max of defined inputs excluding personal progress', () => {
      expect(progressService.calculateEffectiveLatest(100, null, null)).toBe(100);
      expect(progressService.calculateEffectiveLatest(null, 150, null)).toBe(150);
      expect(progressService.calculateEffectiveLatest(null, 150, 160)).toBe(160);
      expect(progressService.calculateEffectiveLatest(170, 150, 160)).toBe(170);
    });
  });

  describe('calculateRemaining', () => {
    it('should return undefined if effectiveLatest is undefined', () => {
      expect(progressService.calculateRemaining(undefined, 50)).toBeUndefined();
    });

    it('should calculate max(effectiveLatest - personalProgress, 0)', () => {
      expect(progressService.calculateRemaining(100, 50)).toBe(50);
      expect(progressService.calculateRemaining(100, 150)).toBe(0); // Cannot be negative
    });
  });

  describe('checkProviderCaughtUp', () => {
    it('should return false if override is null', () => {
      expect(progressService.checkProviderCaughtUp(null, 100, 100)).toBe(false);
    });

    it('should return true if either provider exceeds or equals override', () => {
      expect(progressService.checkProviderCaughtUp(100, 100, null)).toBe(true);
      expect(progressService.checkProviderCaughtUp(100, null, 100)).toBe(true);
      expect(progressService.checkProviderCaughtUp(100, 105, 95)).toBe(true);
      expect(progressService.checkProviderCaughtUp(100, 95, 95)).toBe(false);
    });
  });
});
