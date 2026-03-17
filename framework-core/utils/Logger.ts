/**
 * Lightweight structured logger used across all test modules.
 * Buffers log entries during a test and prints them on flush.
 */
export class Logger {
  private readonly entries: string[] = [];

  constructor(private readonly context: string) {}

  info(message: string): void {
    this.entries.push(`[INFO][${this.context}] ${message}`);
  }

  warn(message: string): void {
    this.entries.push(`[WARN][${this.context}] ${message}`);
  }

  error(message: string, err?: unknown): void {
    const detail = err instanceof Error ? ` | ${err.message}` : '';
    this.entries.push(`[ERROR][${this.context}] ${message}${detail}`);
  }

  debug(message: string): void {
    if (process.env.DEBUG_LOGS === 'true') {
      this.entries.push(`[DEBUG][${this.context}] ${message}`);
    }
  }

  flush(): void {
    if (this.entries.length > 0) {
      console.log(this.entries.join('\n'));
    }
  }
}
