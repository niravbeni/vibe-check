import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import generateLabelsRouter from './routes/generate-labels.js';
import resetVotesRouter from './routes/reset-votes.js';
import promptsRouter from './routes/prompts.js';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set in environment variables');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Register routes
app.use('/api/reset-votes', resetVotesRouter);
app.use('/api/prompts', promptsRouter);
app.use('/api/generate-labels', generateLabelsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 