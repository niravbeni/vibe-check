import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prisma from './lib/prisma'
import generateLabelsRouter from './src/routes/generate-labels'
import resetVotesRouter from './src/routes/reset-votes'

dotenv.config()

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set in environment variables')
  process.exit(1)
}

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))

// Define types for our data structures
type VoteCount = {
  good: number;
  ok: number;
  bad: number;
}

type PromptSummary = {
  id: number;
  name: string;
  promptText: string;
  votes: VoteCount;
  percentages: VoteCount;
  totalVotes: number;
  summary: string;
}

type PromptWithData = {
  id: number;
  name: string;
  promptText: string;
  goodVotes: number;
  okVotes: number;
  badVotes: number;
  totalVotes: number;
  goodPercentage: number;
  okPercentage: number;
  badPercentage: number;
}

type VoteUpdateData = {
  totalVotes: number;
  goodVotes?: number;
  okVotes?: number;
  badVotes?: number;
  goodPercentage: number;
  okPercentage: number;
  badPercentage: number;
}

// Get all prompts with their vote counts
app.get('/api/prompts', async (req, res) => {
  try {
    console.log('Fetching prompts...')
    
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
    })
    console.log('Found prompts:', prompts)

    if (!prompts || prompts.length === 0) {
      return res.json({
        prompts: [],
        totalStats: {
          totalVotes: 0,
          byPrompt: []
        }
      })
    }

    // Transform the data to include vote counts
    const promptsWithCounts: PromptSummary[] = prompts.map((prompt: PromptWithData) => {
      const votes = {
        good: prompt.goodVotes,
        ok: prompt.okVotes,
        bad: prompt.badVotes
      }
      const percentages = {
        good: prompt.goodPercentage,
        ok: prompt.okPercentage,
        bad: prompt.badPercentage
      }

      return {
        id: prompt.id,
        name: prompt.name,
        promptText: prompt.promptText,
        votes,
        percentages,
        totalVotes: prompt.totalVotes,
        summary: `${prompt.name}: ${votes.good} good (${percentages.good}%), ${votes.ok} ok (${percentages.ok}%), ${votes.bad} bad (${percentages.bad}%) - Total: ${prompt.totalVotes}`
      }
    })

    // Sort by total votes or percentage of good votes
    promptsWithCounts.sort((a, b) => b.votes.good - a.votes.good)

    const response = {
      prompts: promptsWithCounts,
      totalStats: {
        totalVotes: promptsWithCounts.reduce((sum, p) => sum + p.totalVotes, 0),
        byPrompt: promptsWithCounts.map(p => p.summary)
      }
    }

    console.log('Sending response:', response)
    res.json(response)

  } catch (error) {
    console.error('Error fetching prompts:', {
      error,
      stack: error instanceof Error ? error.stack : undefined
    })
    res.status(500).json({ 
      error: 'Failed to fetch prompts',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Update the vote endpoint
app.post('/api/prompts/:promptId/vote', async (req, res) => {
  const { promptId } = req.params
  const { score } = req.body

  console.log('Vote request received:', { promptId, score })

  try {
    // Basic validation
    if (!promptId || !score) {
      return res.status(400).json({ error: 'Missing promptId or score' })
    }

    // Validate score value
    if (!['good', 'bad', 'ok'].includes(score)) {
      return res.status(400).json({ error: 'Invalid score value' })
    }

    // Check if prompt exists
    const prompt = await prisma.prompt.findUnique({
      where: { id: parseInt(promptId) }
    })

    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' })
    }

    // Calculate new vote counts
    const newTotalVotes = prompt.totalVotes + 1
    const data: VoteUpdateData = {
      totalVotes: newTotalVotes,
      goodPercentage: 0,
      okPercentage: 0,
      badPercentage: 0
    }

    // Update the specific vote count
    if (score === 'good') data.goodVotes = prompt.goodVotes + 1
    else if (score === 'ok') data.okVotes = prompt.okVotes + 1
    else if (score === 'bad') data.badVotes = prompt.badVotes + 1

    // Calculate new percentages
    const newGoodVotes = data.goodVotes ?? prompt.goodVotes
    const newOkVotes = data.okVotes ?? prompt.okVotes
    const newBadVotes = data.badVotes ?? prompt.badVotes

    data.goodPercentage = Math.round((newGoodVotes / newTotalVotes) * 100)
    data.okPercentage = Math.round((newOkVotes / newTotalVotes) * 100)
    data.badPercentage = Math.round((newBadVotes / newTotalVotes) * 100)

    // Update the prompt
    const updatedPrompt = await prisma.prompt.update({
      where: { id: parseInt(promptId) },
      data
    })

    console.log('Vote recorded:', updatedPrompt)
    res.json({ success: true, prompt: updatedPrompt })

  } catch (error) {
    console.error('Vote creation error:', {
      error,
      promptId,
      score,
      stack: error instanceof Error ? error.stack : undefined
    })

    res.status(500).json({ 
      error: 'Failed to record vote',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Register routes
app.use('/api/reset-votes', resetVotesRouter)
app.use('/api', generateLabelsRouter)

// Update the stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const prompts = await prisma.prompt.findMany()

    const summary = prompts.map((prompt: PromptWithData) => {
      return {
        prompt: prompt.name,
        total: prompt.totalVotes,
        distribution: {
          good: `${prompt.goodVotes} (${prompt.goodPercentage}%)`,
          ok: `${prompt.okVotes} (${prompt.okPercentage}%)`,
          bad: `${prompt.badVotes} (${prompt.badPercentage}%)`
        }
      }
    })

    res.json(summary)
  } catch (err) {
    const error = err as Error
    res.status(500).json({ error: 'Failed to fetch statistics', details: error.message })
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
}) 