import express from 'express';
import { entitiesRouter } from './routes/entities';

const PORT = Number(process.env.API_PORT ?? 3001);

const app = express();
app.use(express.json());

app.use('/api/entities', entitiesRouter);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
