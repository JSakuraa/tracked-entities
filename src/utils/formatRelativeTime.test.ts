import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatRelativeTime } from './formatRelativeTime';

const NOW = new Date('2026-03-15T12:00:00.000Z');

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** ISO string for a moment `ms` milliseconds before NOW. */
const ago = (ms: number) => new Date(NOW.getTime() - ms).toISOString();

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('"just now"', () => {
    it('returns "just now" for the current instant', () => {
      expect(formatRelativeTime(ago(0))).toBe('just now');
    });

    it('returns "just now" up to 4.999 seconds ago', () => {
      expect(formatRelativeTime(ago(4 * SECOND))).toBe('just now');
      expect(formatRelativeTime(ago(5 * SECOND - 1))).toBe('just now');
    });

    it('returns "just now" for timestamps slightly in the future (clock skew)', () => {
      expect(formatRelativeTime(ago(-3 * SECOND))).toBe('just now');
    });

    it('returns "just now" for timestamps far in the future', () => {
      expect(formatRelativeTime(ago(-2 * DAY))).toBe('just now');
    });
  });

  describe('seconds', () => {
    it('switches from "just now" to seconds at exactly 5 seconds', () => {
      expect(formatRelativeTime(ago(5 * SECOND))).toBe('5 seconds ago');
    });

    it('floors partial seconds', () => {
      expect(formatRelativeTime(ago(30 * SECOND + 999))).toBe('30 seconds ago');
    });

    it('returns "59 seconds ago" right before the minute boundary', () => {
      expect(formatRelativeTime(ago(59 * SECOND))).toBe('59 seconds ago');
      expect(formatRelativeTime(ago(MINUTE - 1))).toBe('59 seconds ago');
    });
  });

  describe('minutes', () => {
    it('returns "1 minute ago" (singular) at exactly 60 seconds', () => {
      expect(formatRelativeTime(ago(MINUTE))).toBe('1 minute ago');
    });

    it('stays at "1 minute ago" until 2 full minutes have passed', () => {
      expect(formatRelativeTime(ago(2 * MINUTE - 1))).toBe('1 minute ago');
      expect(formatRelativeTime(ago(2 * MINUTE))).toBe('2 minutes ago');
    });

    it('returns plural minutes', () => {
      expect(formatRelativeTime(ago(3 * MINUTE))).toBe('3 minutes ago');
    });

    it('returns "59 minutes ago" right before the hour boundary', () => {
      expect(formatRelativeTime(ago(HOUR - 1))).toBe('59 minutes ago');
    });
  });

  describe('hours', () => {
    it('returns "1 hour ago" (singular) at exactly 60 minutes', () => {
      expect(formatRelativeTime(ago(HOUR))).toBe('1 hour ago');
    });

    it('returns plural hours', () => {
      expect(formatRelativeTime(ago(2 * HOUR))).toBe('2 hours ago');
    });

    it('floors partial hours', () => {
      expect(formatRelativeTime(ago(5 * HOUR + 59 * MINUTE))).toBe('5 hours ago');
    });

    it('returns "23 hours ago" right before the day boundary', () => {
      expect(formatRelativeTime(ago(DAY - 1))).toBe('23 hours ago');
    });
  });

  describe('"yesterday"', () => {
    it('returns "yesterday" at exactly 24 hours', () => {
      expect(formatRelativeTime(ago(DAY))).toBe('yesterday');
    });

    it('returns "yesterday" right up to 48 hours', () => {
      expect(formatRelativeTime(ago(2 * DAY - 1))).toBe('yesterday');
    });
  });

  describe('days', () => {
    it('returns "2 days ago" at exactly 48 hours', () => {
      expect(formatRelativeTime(ago(2 * DAY))).toBe('2 days ago');
    });

    it('returns "6 days ago" right before the week boundary', () => {
      expect(formatRelativeTime(ago(7 * DAY - 1))).toBe('6 days ago');
    });
  });

  describe('weeks', () => {
    it('returns "1 week ago" (singular) at exactly 7 days', () => {
      expect(formatRelativeTime(ago(7 * DAY))).toBe('1 week ago');
    });

    it('floors partial weeks', () => {
      expect(formatRelativeTime(ago(13 * DAY))).toBe('1 week ago');
      expect(formatRelativeTime(ago(14 * DAY))).toBe('2 weeks ago');
    });

    it('returns "4 weeks ago" right before the month boundary', () => {
      expect(formatRelativeTime(ago(30 * DAY - 1))).toBe('4 weeks ago');
    });
  });

  describe('months', () => {
    it('returns "1 month ago" (singular) at exactly 30 days', () => {
      expect(formatRelativeTime(ago(30 * DAY))).toBe('1 month ago');
    });

    it('returns plural months using 30-day months', () => {
      expect(formatRelativeTime(ago(60 * DAY))).toBe('2 months ago');
      expect(formatRelativeTime(ago(89 * DAY))).toBe('2 months ago');
    });

    it('returns "12 months ago" right before the year boundary', () => {
      expect(formatRelativeTime(ago(365 * DAY - 1))).toBe('12 months ago');
    });
  });

  describe('years', () => {
    it('returns "1 year ago" (singular) at exactly 365 days', () => {
      expect(formatRelativeTime(ago(365 * DAY))).toBe('1 year ago');
    });

    it('returns plural years using 365-day years', () => {
      expect(formatRelativeTime(ago(3 * 365 * DAY + 100 * DAY))).toBe('3 years ago');
    });
  });

  describe('input handling', () => {
    it('accepts timestamps with a timezone offset instead of Z', () => {
      // 11:00 UTC expressed in UTC-05:00 -> one hour before NOW
      expect(formatRelativeTime('2026-03-15T06:00:00.000-05:00')).toBe('1 hour ago');
    });

    it('accepts timestamps without milliseconds', () => {
      expect(formatRelativeTime('2026-03-15T11:57:00Z')).toBe('3 minutes ago');
    });

    it('returns "unknown" for an empty string', () => {
      expect(formatRelativeTime('')).toBe('unknown');
    });

    it('returns "unknown" for an unparseable string', () => {
      expect(formatRelativeTime('not-a-date')).toBe('unknown');
    });

    it('does not throw on bad input', () => {
      expect(() => formatRelativeTime('2026-13-45T99:99:99Z')).not.toThrow();
      expect(formatRelativeTime('2026-13-45T99:99:99Z')).toBe('unknown');
    });
  });

  it('reads the current time at call time rather than caching it', () => {
    const timestamp = ago(0);
    expect(formatRelativeTime(timestamp)).toBe('just now');

    vi.advanceTimersByTime(10 * MINUTE);
    expect(formatRelativeTime(timestamp)).toBe('10 minutes ago');
  });
});
