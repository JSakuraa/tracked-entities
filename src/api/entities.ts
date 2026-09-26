import type { EntitiesResponse, Entity } from '../../shared/types';

const BASE_URL = '/api/entities';

export async function fetchEntities(): Promise<Entity[]> {
  const res = await fetch(BASE_URL);
  const body: EntitiesResponse = await res.json();
  return body.data;
}
