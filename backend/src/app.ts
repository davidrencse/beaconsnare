import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';

const app = express();

app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

app.use('/api/v1', routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
      details: null
    }
  });
});

app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const error = err instanceof Error ? err : new Error('Unknown server error');

  res.status(500).json({
    success: false,
    data: null,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message,
      details: null
    }
  });
});

export default app;
