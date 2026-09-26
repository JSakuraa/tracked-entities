import { Router } from 'express';
import type { EntitiesResponse } from '../../shared/types';
import { entities } from '../data';

// Simulated network latency so the client behaves like it's talking to a real API.
const LATENCY_MS = 600;

export const entitiesRouter = Router();

entitiesRouter.get('/', (_req, res) => {
  setTimeout(() => {
    const body: EntitiesResponse = { data: entities };
    res.json(body);
  }, LATENCY_MS);
});
