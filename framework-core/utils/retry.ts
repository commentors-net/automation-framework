/**
 * Retries an asynchronous operation up to `maxAttempts` times with an
 * exponential back-off between retries.
 *
 * @param operation - The async function to execute.
 * @param maxAttempts - Maximum number of attempts (default 3).
 * @param delayMs - Initial delay in milliseconds between retries (default 500).
 */
export async function retry<T>(
  operation: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 500,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        await sleep(delayMs * Math.pow(2, attempt - 1));
      }
    }
  }

  throw lastError;
}

/**
 * Returns a promise that resolves after the given number of milliseconds.
 * Prefer using this over arbitrary `page.waitForTimeout` calls.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
