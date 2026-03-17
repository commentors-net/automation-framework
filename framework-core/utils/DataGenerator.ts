import { randomUUID } from 'crypto';

/**
 * Generates random test data values to avoid hard-coded values in tests.
 */
export class DataGenerator {
  /** Returns a UUID v4 string. */
  static uuid(): string {
    return randomUUID();
  }

  /** Returns a random e-mail address unique to this test run. */
  static email(domain = 'test.example.com'): string {
    return `user-${Date.now()}-${Math.floor(Math.random() * 10_000)}@${domain}`;
  }

  /** Returns a random full name. */
  static fullName(): string {
    const firstNames = ['Alice', 'Bob', 'Carol', 'David', 'Eve', 'Frank'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  }

  /** Returns a random phone number string. */
  static phoneNumber(): string {
    const digits = (): string => Math.floor(Math.random() * 900 + 100).toString();
    return `+1-${digits()}-${digits()}-${digits()}`;
  }

  /** Returns a random integer between min (inclusive) and max (exclusive). */
  static integer(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /** Returns a random element from an array. */
  static pick<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }
}
