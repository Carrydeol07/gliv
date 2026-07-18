export class RateLimiter {
  private queue: Array<() => void> = [];
  private tokens: number;
  private lastRefillTime: number;

  constructor(
    private readonly maxRequests: number,
    private readonly windowMs: number
  ) {
    this.tokens = maxRequests;
    this.lastRefillTime = Date.now();
  }

  public async acquire(): Promise<void> {
    this.refill();

    if (this.tokens > 0) {
      this.tokens--;
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.queue.push(resolve);
      this.scheduleNext();
    });
  }

  private refill() {
    const now = Date.now();
    const timePassed = now - this.lastRefillTime;
    const refillAmount = Math.floor(timePassed / this.windowMs) * this.maxRequests;
    
    if (refillAmount > 0) {
      this.tokens = Math.min(this.maxRequests, this.tokens + refillAmount);
      this.lastRefillTime = now;
    }
  }

  private scheduleNext() {
    setTimeout(() => {
      this.refill();
      if (this.tokens > 0 && this.queue.length > 0) {
        this.tokens--;
        const resolve = this.queue.shift();
        if (resolve) resolve();
      }
      if (this.queue.length > 0) {
        this.scheduleNext();
      }
    }, this.windowMs / this.maxRequests);
  }
}
