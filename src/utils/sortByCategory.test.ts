import { describe, expect, it } from 'vitest';
import type { Entity } from '../../shared/types';
import { sortByCategory } from './sortByCategory';

function makeEntity(id: string, category: string, overrides: Partial<Entity> = {}): Entity {
  return {
    id,
    name: `Entity ${id}`,
    status: 'active',
    category,
    location: { lat: 0, lng: 0 },
    lastUpdated: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

const ids = (entities: Entity[]) => entities.map((e) => e.id);
const categories = (entities: Entity[]) => entities.map((e) => e.category);

describe('sortByCategory', () => {
  describe('basic ordering', () => {
    it('returns an empty array for empty input', () => {
      expect(sortByCategory([])).toEqual([]);
    });

    it('returns a single entity unchanged', () => {
      const only = makeEntity('1', 'vehicle');
      expect(sortByCategory([only])).toEqual([only]);
    });

    it('sorts lowercase categories alphabetically (ascending by default)', () => {
      const input = [
        makeEntity('1', 'vehicle'),
        makeEntity('2', 'equipment'),
        makeEntity('3', 'personnel'),
      ];

      expect(categories(sortByCategory(input))).toEqual(['equipment', 'personnel', 'vehicle']);
    });

    it('sorts descending when asked', () => {
      const input = [
        makeEntity('1', 'equipment'),
        makeEntity('2', 'vehicle'),
        makeEntity('3', 'personnel'),
      ];

      expect(categories(sortByCategory(input, 'desc'))).toEqual([
        'vehicle',
        'personnel',
        'equipment',
      ]);
    });

    it('handles input that is already sorted', () => {
      const input = [makeEntity('1', 'a'), makeEntity('2', 'b'), makeEntity('3', 'c')];
      expect(ids(sortByCategory(input))).toEqual(['1', '2', '3']);
    });
  });

  describe('mixed-case categories', () => {
    it('orders categories alphabetically regardless of capitalization', () => {
      const input = [
        makeEntity('1', 'Vehicle'),
        makeEntity('2', 'equipment'),
        makeEntity('3', 'Personnel'),
      ];

      expect(categories(sortByCategory(input))).toEqual(['equipment', 'Personnel', 'Vehicle']);
    });

    it('does not place an uppercase category before a lowercase one that comes earlier in the alphabet', () => {
      const input = [makeEntity('1', 'Vehicle'), makeEntity('2', 'equipment')];

      expect(ids(sortByCategory(input))).toEqual(['2', '1']);
    });

    it('keeps "Vehicle" and "vehicle" together as the same category', () => {
      const input = [
        makeEntity('1', 'vehicle'),
        makeEntity('2', 'personnel'),
        makeEntity('3', 'Vehicle'),
        makeEntity('4', 'equipment'),
        makeEntity('5', 'VEHICLE'),
      ];

      const result = sortByCategory(input);

      expect(ids(result)).toEqual(['4', '2', '1', '3', '5']);
    });

    it('produces the same order in descending mode regardless of casing', () => {
      const input = [
        makeEntity('1', 'equipment'),
        makeEntity('2', 'Vehicle'),
        makeEntity('3', 'personnel'),
        makeEntity('4', 'Equipment'),
      ];

      expect(ids(sortByCategory(input, 'desc'))).toEqual(['2', '3', '1', '4']);
    });
  });

  describe('stability', () => {
    it('keeps the original relative order of entities in the same category', () => {
      const input = [
        makeEntity('a', 'vehicle'),
        makeEntity('b', 'equipment'),
        makeEntity('c', 'vehicle'),
        makeEntity('d', 'equipment'),
        makeEntity('e', 'vehicle'),
      ];

      expect(ids(sortByCategory(input))).toEqual(['b', 'd', 'a', 'c', 'e']);
    });

    it('keeps the original relative order in descending mode too', () => {
      const input = [
        makeEntity('a', 'vehicle'),
        makeEntity('b', 'equipment'),
        makeEntity('c', 'vehicle'),
      ];

      expect(ids(sortByCategory(input, 'desc'))).toEqual(['a', 'c', 'b']);
    });

    it('gives the same result when called repeatedly on the same input', () => {
      const input = [
        makeEntity('1', 'Vehicle'),
        makeEntity('2', 'equipment'),
        makeEntity('3', 'vehicle'),
      ];

      const first = ids(sortByCategory(input));
      const second = ids(sortByCategory(input));

      expect(second).toEqual(first);
    });
  });

  describe('immutability', () => {
    it('does not reorder the array that was passed in', () => {
      const input = [
        makeEntity('1', 'vehicle'),
        makeEntity('2', 'equipment'),
        makeEntity('3', 'personnel'),
      ];
      const originalOrder = ids(input);

      sortByCategory(input);

      expect(ids(input)).toEqual(originalOrder);
    });

    it('returns a new array instance', () => {
      const input = [makeEntity('1', 'vehicle'), makeEntity('2', 'equipment')];

      const result = sortByCategory(input);

      expect(result).not.toBe(input);
    });

    it('returns a new array instance even for empty input', () => {
      const input: Entity[] = [];
      expect(sortByCategory(input)).not.toBe(input);
    });

    it('does not modify the entity objects or their categories', () => {
      const input = [makeEntity('1', 'Vehicle'), makeEntity('2', 'equipment')];
      const snapshot = structuredClone(input);

      sortByCategory(input);

      expect(input).toEqual(snapshot);
    });

    it('lets callers sort ascending then descending from the same source without interference', () => {
      const source = [
        makeEntity('1', 'personnel'),
        makeEntity('2', 'vehicle'),
        makeEntity('3', 'equipment'),
      ];

      const asc = sortByCategory(source, 'asc');
      const desc = sortByCategory(source, 'desc');

      expect(categories(asc)).toEqual(['equipment', 'personnel', 'vehicle']);
      expect(categories(desc)).toEqual(['vehicle', 'personnel', 'equipment']);
      expect(ids(source)).toEqual(['1', '2', '3']);
    });

    it('works on a frozen (read-only) array', () => {
      const input = Object.freeze([
        makeEntity('1', 'vehicle'),
        makeEntity('2', 'equipment'),
      ]) as Entity[];

      expect(() => sortByCategory(input)).not.toThrow();
      expect(ids(sortByCategory(input))).toEqual(['2', '1']);
    });
  });
});
