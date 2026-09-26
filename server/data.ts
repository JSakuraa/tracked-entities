import type { Entity } from '../shared/types';

// Timestamps are generated relative to server start so the relative-time
// display always has a realistic spread of values.
const now = Date.now();
const secondsAgo = (s: number) => new Date(now - s * 1000).toISOString();
const minutesAgo = (m: number) => secondsAgo(m * 60);
const hoursAgo = (h: number) => minutesAgo(h * 60);
const daysAgo = (d: number) => hoursAgo(d * 24);

// Records are merged from several upstream feeds, so category casing is not
// guaranteed to be consistent.
export const entities: Entity[] = [
  {
    id: 'ent-001',
    name: 'Patrol Truck 12',
    status: 'active',
    category: 'vehicle',
    location: { lat: 38.8977, lng: -77.0365 },
    lastUpdated: secondsAgo(20),
  },
  {
    id: 'ent-002',
    name: 'Field Team Bravo',
    status: 'active',
    category: 'personnel',
    location: { lat: 38.9072, lng: -77.0369 },
    lastUpdated: minutesAgo(3),
  },
  {
    id: 'ent-003',
    name: 'Generator G-4',
    status: 'inactive',
    category: 'equipment',
    location: { lat: 38.8895, lng: -77.0353 },
    lastUpdated: daysAgo(4),
  },
  {
    id: 'ent-004',
    name: 'Supply Van 7',
    status: 'alert',
    category: 'Vehicle',
    location: { lat: 38.8816, lng: -77.091 },
    lastUpdated: minutesAgo(1),
  },
  {
    id: 'ent-005',
    name: 'Medic Unit Delta',
    status: 'active',
    category: 'personnel',
    location: { lat: 38.9101, lng: -77.0147 },
    lastUpdated: minutesAgo(12),
  },
  {
    id: 'ent-006',
    name: 'Radio Relay R-2',
    status: 'alert',
    category: 'equipment',
    location: { lat: 38.8462, lng: -77.3064 },
    lastUpdated: hoursAgo(2),
  },
  {
    id: 'ent-007',
    name: 'Utility Truck 3',
    status: 'inactive',
    category: 'vehicle',
    location: { lat: 38.8048, lng: -77.0469 },
    lastUpdated: daysAgo(1),
  },
  {
    id: 'ent-008',
    name: 'Survey Crew Echo',
    status: 'inactive',
    category: 'Personnel',
    location: { lat: 38.9338, lng: -77.1772 },
    lastUpdated: daysAgo(9),
  },
  {
    id: 'ent-009',
    name: 'Drone D-11',
    status: 'active',
    category: 'equipment',
    location: { lat: 38.8719, lng: -77.0563 },
    lastUpdated: secondsAgo(45),
  },
  {
    id: 'ent-010',
    name: 'Ambulance 5',
    status: 'alert',
    category: 'vehicle',
    location: { lat: 38.9296, lng: -77.0325 },
    lastUpdated: minutesAgo(58),
  },
  {
    id: 'ent-011',
    name: 'Water Pump P-9',
    status: 'active',
    category: 'Equipment',
    location: { lat: 38.8601, lng: -76.9951 },
    lastUpdated: hoursAgo(5),
  },
  {
    id: 'ent-012',
    name: 'Security Detail Alpha',
    status: 'active',
    category: 'personnel',
    location: { lat: 38.8899, lng: -77.009 },
    lastUpdated: secondsAgo(4),
  },
  {
    id: 'ent-013',
    name: 'Forklift F-1',
    status: 'inactive',
    category: 'equipment',
    location: { lat: 38.8483, lng: -77.0421 },
    lastUpdated: daysAgo(21),
  },
  {
    id: 'ent-014',
    name: 'Command Vehicle 1',
    status: 'active',
    category: 'Vehicle',
    location: { lat: 38.8951, lng: -77.0364 },
    lastUpdated: minutesAgo(7),
  },
  {
    id: 'ent-015',
    name: 'Recon Team Foxtrot',
    status: 'alert',
    category: 'personnel',
    location: { lat: 38.9531, lng: -77.0668 },
    lastUpdated: hoursAgo(1),
  },
  {
    id: 'ent-016',
    name: 'Light Tower L-6',
    status: 'inactive',
    category: 'equipment',
    location: { lat: 38.8229, lng: -77.0036 },
    lastUpdated: daysAgo(45),
  },
  {
    id: 'ent-017',
    name: 'Fuel Tanker 2',
    status: 'active',
    category: 'vehicle',
    location: { lat: 38.8687, lng: -77.2297 },
    lastUpdated: hoursAgo(20),
  },
  {
    id: 'ent-018',
    name: 'Dispatch Team Golf',
    status: 'active',
    category: 'personnel',
    location: { lat: 38.9007, lng: -77.0432 },
    lastUpdated: daysAgo(2),
  },
];
