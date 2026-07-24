export class EffectiveLatestCalculator {
  /**
   * Calculates the Effective Latest progress based on BR-001.
   * Returns undefined if no values are present (e.g. for Manual Formats or when no data is known).
   */
  static calculate(
    latestOfficialRelease?: number | null,
    latestScanlationRelease?: number | null,
    progressOverride?: number | null
  ): number | undefined {
    const values: number[] = [];

    if (typeof latestOfficialRelease === 'number') {
      values.push(latestOfficialRelease);
    }
    if (typeof latestScanlationRelease === 'number') {
      values.push(latestScanlationRelease);
    }
    if (typeof progressOverride === 'number') {
      values.push(progressOverride);
    }

    if (values.length === 0) {
      return undefined;
    }

    return Math.max(...values);
  }
}
