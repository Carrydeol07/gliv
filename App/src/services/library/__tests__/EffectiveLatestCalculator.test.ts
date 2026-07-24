import { describe, it, expect } from 'vitest';
import { EffectiveLatestCalculator } from '../EffectiveLatestCalculator';

describe('EffectiveLatestCalculator', () => {
  it('returns MAX of official, scanlation, and override', () => {
    expect(EffectiveLatestCalculator.calculate(10, 15, 12)).toBe(15);
    expect(EffectiveLatestCalculator.calculate(20, 5, 2)).toBe(20);
    expect(EffectiveLatestCalculator.calculate(5, 5, 25)).toBe(25);
  });

  it('ignores null or undefined values', () => {
    expect(EffectiveLatestCalculator.calculate(10, null, undefined)).toBe(10);
    expect(EffectiveLatestCalculator.calculate(null, 15, null)).toBe(15);
  });

  it('returns undefined if all are empty', () => {
    expect(EffectiveLatestCalculator.calculate(null, undefined, null)).toBeUndefined();
    expect(EffectiveLatestCalculator.calculate()).toBeUndefined();
  });
});
