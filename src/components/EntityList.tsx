import { useEffect, useState } from 'react';
import { ENTITY_STATUSES, type Entity, } from '../../shared/types';
import { fetchEntities } from '../api/entities';
import { sortByCategory } from '../utils/sortByCategory';
import { StatusBadge } from './StatusBadge';

const FILTER_OPTIONS = [
  ...ENTITY_STATUSES,
  "all"
] as const;
type FilterOption = typeof FILTER_OPTIONS[number];

export function EntityList() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [sortEnabled, setSortEnabled] = useState(false);
  const [filter, setFilter] = useState<FilterOption>("all");

  useEffect(() => {
    fetchEntities().then(setEntities);
  }, []);

  const filteredEntities = filter === "all" ? entities : entities.filter((entity) => entity.status === filter);
  const visibleEntities = sortEnabled ? sortByCategory(filteredEntities) : filteredEntities;

  return (
    <section className="entity-list">
      <div className="entity-list__toolbar">
        <label>
          <input
            type="checkbox"
            checked={sortEnabled}
            onChange={(e) => setSortEnabled(e.target.checked)}
          />
          Sort by category
        </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value as FilterOption)}>
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <span className="entity-list__count">{visibleEntities.length} entities</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {visibleEntities.map((entity) => (
            <tr key={entity.id}>
              <td>{entity.name}</td>
              <td>
                <StatusBadge status={entity.status} />
              </td>
              <td>{entity.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
