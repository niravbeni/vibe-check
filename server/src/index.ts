import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from '../lib/prisma.js';
import generateLabelsRouter from './routes/generate-labels.js';
import resetVotesRouter from './routes/reset-votes.js';
import promptsRouter from './routes/prompts.js';
import type { PrismaClient } from '@prisma/client';

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

interface PromptWithCounts {
  id: number;
  name: string;
  promptText: string;
  votes: {
    good: number;
    ok: number;
    bad: number;
  };
  percentages: {
    good: number;
    ok: number;
    bad: number;
  };
  totalVotes: number;
  summary: string;
}

interface VoteUpdateData {
  goodVotes?: number;
  okVotes?: number;
  badVotes?: number;
  totalVotes: number;
  goodPercentage: number;
  okPercentage: number;
  badPercentage: number;
}

type PromptFromDB = NonNullable<Awaited<ReturnType<PrismaClient['prompt']['findUnique']>>>;

// Get all prompts with their vote counts
app.get('/api/prompts', async (req, res) => {
  try {
    console.log('Fetching prompts...');
    
    const prompts = await prisma.prompt.findMany({
      select: {
        id: true,
        name: true,
        promptText: true,
        goodVotes: true,
        okVotes: true,
        badVotes: true,
        totalVotes: true,
        goodPercentage: true,
        okPercentage: true,
        badPercentage: true
      }
    });

    if (!prompts || prompts.length === 0) {
      return res.json({
        prompts: [],
        totalStats: {
          totalVotes: 0,
          byPrompt: []
        }
      });
    }

    // Transform the data to include vote counts
    const promptsWithCounts: PromptWithCounts[] = prompts.map((prompt: PromptFromDB) => {
      const votes = {
        good: prompt.goodVotes,
        ok: prompt.okVotes,
        bad: prompt.badVotes
      };
      const percentages = {
        good: prompt.goodPercentage,
        ok: prompt.okPercentage,
        bad: prompt.badPercentage
      };

      return {
        id: prompt.id,
        name: prompt.name,
        promptText: prompt.promptText,
        votes,
        percentages,
        totalVotes: prompt.totalVotes,
        summary: `${prompt.name}: ${votes.good} good (${percentages.good}%), ${votes.ok} ok (${percentages.ok}%), ${votes.bad} bad (${percentages.bad}%) - Total: ${prompt.totalVotes}`
      };
    });

    // Sort by total votes or percentage of good votes
    promptsWithCounts.sort((a: PromptWithCounts, b: PromptWithCounts) => b.votes.good - a.votes.good);

    const response = {
      prompts: promptsWithCounts,
      totalStats: {
        totalVotes: promptsWithCounts.reduce((sum: number, p: PromptWithCounts) => sum + p.totalVotes, 0),
        byPrompt: promptsWithCounts.map((p: PromptWithCounts) => p.summary)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch prompts',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update the vote endpoint
app.post('/api/prompts/:promptId/vote', async (req, res) => {
  const { promptId } = req.params;
  const { score } = req.body;

  try {
    // Basic validation
    if (!promptId || !score) {
      return res.status(400).json({ error: 'Missing promptId or score' });
    }

    // Validate score value
    if (!['good', 'bad', 'ok'].includes(score)) {
      return res.status(400).json({ error: 'Invalid score value' });
    }

    // Check if prompt exists
    const prompt = await prisma.prompt.findUnique({
      where: { id: parseInt(promptId) }
    });

    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    // Calculate new vote counts
    const newTotalVotes = prompt.totalVotes + 1;
    const data: VoteUpdateData = {
      goodVotes: score === 'good' ? prompt.goodVotes + 1 : prompt.goodVotes,
      okVotes: score === 'ok' ? prompt.okVotes + 1 : prompt.okVotes,
      badVotes: score === 'bad' ? prompt.badVotes + 1 : prompt.badVotes,
      totalVotes: newTotalVotes,
      goodPercentage: 0,
      okPercentage: 0,
      badPercentage: 0
    };

    // Calculate new percentages
    const goodVotes = data.goodVotes || 0;
    const okVotes = data.okVotes || 0;
    const badVotes = data.badVotes || 0;

    data.goodPercentage = Math.round((goodVotes / newTotalVotes) * 100);
    data.okPercentage = Math.round((okVotes / newTotalVotes) * 100);
    data.badPercentage = Math.round((badVotes / newTotalVotes) * 100);

    // Update the prompt
    const updatedPrompt = await prisma.prompt.update({
      where: { id: parseInt(promptId) },
      data
    });

    res.json({ success: true, prompt: updatedPrompt });
  } catch (error) {
    console.error('Vote creation error:', error);
    res.status(500).json({ 
      error: 'Failed to record vote',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 