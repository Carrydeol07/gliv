export interface RetryOptions {
  maxRetries: number;
  initialDelayMs: number;
  backoffFactor: number;
  timeoutMs: number;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 2,       // 1 initial + 2 retries = 3 total attempts
  initialDelayMs: 500, // 500ms, then 1000ms between retries
  backoffFactor: 2,
  timeoutMs: 8000      // 8s hard cap per individual attempt
};

export class RetryHandler {
  public static async withRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = DEFAULT_RETRY_OPTIONS
  ): Promise<T> {
    let attempt = 0;
    let currentDelay = options.initialDelayMs;

    while (attempt <= options.maxRetries) {
      try {
        return await this.withTimeout(operation(), options.timeoutMs);
      } catch (error) {
        attempt++;
        if (attempt > options.maxRetries) {
          throw error;
        }
        
        await new Promise((resolve) => setTimeout(resolve, currentDelay));
        currentDelay *= options.backoffFactor;
      }
    }

    throw new Error('Unreachable');
  }

  private static withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms);
      promise.then(
        (value) => { clearTimeout(timer); resolve(value); },
        (err) => { clearTimeout(timer); reject(err); }
      );
    });
  }
}
