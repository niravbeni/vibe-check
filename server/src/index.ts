import * as dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import generateLabelsRouter from './routes/generate-labels.js';
import resetVotesRouter from './routes/reset-votes.js';
import promptsRouter from './routes/prompts.js';

// Load environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set in environment variables');
  process.exit(1);
}

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies with increased limit
app.use(express.json({ limit: '50mb' }));

// Debug middleware to log all requests
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});

// Register routes
console.log('Registering routes...');

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  console.log('Health check endpoint hit');
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// Mount routers
app.use('/api/reset-votes', resetVotesRouter);
app.use('/api/prompts', promptsRouter);
app.use('/api/generate-labels', generateLabelsRouter);

// Define type for router layer
interface RouterLayer {
  route?: {
    path: string;
    methods: Record<string, boolean>;
  };
}

// Debug: Log registered routes
app.use((req: Request, res: Response, next: NextFunction) => {
  const routes = (app._router.stack as RouterLayer[])
    .filter((layer) => layer.route)
    .map((layer) => `${Object.keys(layer.route!.methods)} ${layer.route!.path}`);
  console.log('Available routes:', routes);
  next();
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  console.log('404 Not Found:', req.method, req.path);
  res.status(404).json({ error: 'Not found' });
});

console.log('Routes registered');

// List available routes
const routes = [
  'GET /api/health',
  'GET /api/prompts',
  'POST /api/prompts/:promptId/vote',
  'POST /api/generate-labels',
  'POST /api/reset-votes'
];

// Start server
const port = Number(process.env.PORT) || 3000;
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

app.listen(port, host, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Server listening on ${host}:${port}`);
  console.log('Available routes:');
  routes.forEach(route => console.log(`- ${route}`));
}); 