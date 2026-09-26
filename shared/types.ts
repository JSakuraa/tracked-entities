// Shared between the Express server and the React client.

export const ENTITY_STATUSES = ["active", "inactive", "alert"] as const;
export type EntityStatus = typeof ENTITY_STATUSES[number];

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface Entity {
  id: string;
  name: string;
  status: EntityStatus;
  /** Free-form category, e.g. "vehicle", "personnel", "equipment". */
  category: string;
  location: GeoLocation;
  /** ISO 8601 timestamp of the most recent position/status report. */
  lastUpdated: string;
}

export interface EntitiesResponse {
  data: Entity[];
}
