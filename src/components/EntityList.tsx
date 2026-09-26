import { useEffect, useState } from 'react';
import { type Entity } from '../../shared/types';
import { fetchEntities } from '../api/entities';
import { sortByCategory } from '../utils/sortByCategory';
import { StatusBadge } from './StatusBadge';

export function EntityList() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [sortEnabled, setSortEnabled] = useState(false);

  useEffect(() => {
    fetchEntities().then(setEntities);
  }, []);

  const visibleEntities = sortEnabled ? sortByCategory(entities) : entities;

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
