import express from 'express'
import OpenAI from 'openai'
import cors from 'cors'
import dotenv from 'dotenv'
import prisma from './lib/prisma'
import { randomUUID } from 'crypto'

dotenv.config()

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set in environment variables')
  process.exit(1)
}

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Define types for our data structures
type Vote = {
  score: string;
  id: string;
}

type PromptWithVoteData = {
  id: string;
  name: string;
  promptText: string;
  systemPrompt: string | null;
  votes: Vote[];
}

type VoteCount = {
  good: number;
  ok: number;
  bad: number;
}

type PromptSummary = {
  id: string;
  name: string;
  promptText: string;
  systemPrompt: string | null;
  votes: VoteCount;
  percentages: VoteCount;
  totalVotes: number;
  summary: string;
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
        systemPrompt: true,
        votes: {
          select: {
            score: true
          }
        }
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
    const promptsWithCounts: PromptSummary[] = prompts.map((prompt: PromptWithVoteData) => {
      const voteCount = {
        good: prompt.votes.filter((v: Vote) => v.score === 'good').length,
        ok: prompt.votes.filter((v: Vote) => v.score === 'ok').length,
        bad: prompt.votes.filter((v: Vote) => v.score === 'bad').length
      }
      
      const totalVotes = voteCount.good + voteCount.ok + voteCount.bad
      const percentages = {
        good: totalVotes ? Math.round((voteCount.good / totalVotes) * 100) : 0,
        ok: totalVotes ? Math.round((voteCount.ok / totalVotes) * 100) : 0,
        bad: totalVotes ? Math.round((voteCount.bad / totalVotes) * 100) : 0
      }

      return {
        id: prompt.id,
        name: prompt.name,
        promptText: prompt.promptText,
        systemPrompt: prompt.systemPrompt,
        votes: voteCount,
        percentages,
        totalVotes,
        summary: `${prompt.name}: ${voteCount.good} good (${percentages.good}%), ${voteCount.ok} ok (${percentages.ok}%), ${voteCount.bad} bad (${percentages.bad}%) - Total: ${totalVotes}`
      }
    })

    // Sort by total votes or percentage of good votes
    promptsWithCounts.sort((a: PromptSummary, b: PromptSummary) => b.votes.good - a.votes.good)

    const response = {
      prompts: promptsWithCounts,
      totalStats: {
        totalVotes: promptsWithCounts.reduce((sum: number, p: PromptSummary) => sum + p.totalVotes, 0),
        byPrompt: promptsWithCounts.map((p: PromptSummary) => p.summary)
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
      where: { id: promptId }
    })

    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' })
    }

    // Create vote with explicit data
    const vote = await prisma.vote.create({
      data: {
        id: randomUUID(),
        promptId,
        score,
        createdAt: new Date()
      }
    })

    console.log('Vote created:', vote)
    res.json({ success: true, vote })

  } catch (error) {
    console.error('Vote creation error:', {
      error,
      promptId,
      score,
      stack: error instanceof Error ? error.stack : undefined
    })

    res.status(500).json({ 
      error: 'Failed to create vote',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Update PromptWithSystem type
type PromptWithSystem = {
  id: string;
  name: string;
  promptText: string;
  systemPrompt?: string;
}

app.post('/api/generate-labels', async (req, res) => {
  try {
    const { images } = req.body
    
    console.log('Server received request:', {
      numberOfImages: images?.length || 0,
      hasImages: !!images,
      firstImageType: images?.[0]?.base64?.substring(0, 50)
    })

    if (!images || images.length !== 3) {
      throw new Error('Exactly 3 images are required')
    }

    try {
      const prompts = await prisma.prompt.findMany()
      if (!prompts || prompts.length === 0) {
        throw new Error('No prompts found in database')
      }

      // Generate separate labels for each prompt
      const results = await Promise.all(prompts.map(async (prompt: PromptWithSystem) => {
        try {
          const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `${prompt.systemPrompt || "You are an AI trained to analyze images"}. 
                  CRITICAL INSTRUCTION: Respond ONLY with short, single-word or two-word labels separated by commas.
                  NO sentences, descriptions, or explanations.
                  NO categories or headers.
                  NO image numbering.
                  
                  GOOD EXAMPLE: "minimalist, calm, sophisticated, urban, confident, modern"
                  BAD EXAMPLE: "Mood: Calm and relaxed. The atmosphere is minimalistic..."
                  
                  Keep labels concise and avoid any formatting or explanatory text.`
              },
              {
                role: "user",
                content: [
                  { 
                    type: "text", 
                    text: `${prompt.promptText || "Analyze these images"}. 
                      Return ONLY comma-separated labels.
                      Example format: "elegant, modern, minimal, bold, refined"` 
                  },
                  ...images.map((img: { base64: string }) => ({
                    type: "image_url",
                    image_url: {
                      url: img.base64,
                      detail: "low"
                    }
                  }))
                ]
              }
            ],
            max_tokens: 300
          })

          const content = response.choices[0]?.message?.content || ''
          const cleanedLabels = content
            .replace(/\n/g, ' ')
            .replace(/\d+\./g, '')
            .replace(/\*\*/g, '')
            .replace(/Image \d+:?/gi, '')
            .replace(/[-•]/g, ',')
            .replace(/Mood:|Atmosphere:|Emotional Qualities:|Overall:/gi, '')  // Remove common headers
            .replace(/\s+/g, ' ')  // Normalize whitespace
            .split(',')
            .map(label => label.trim())
            .filter(label => 
              label.length > 0 && 
              !label.includes('image') && 
              !label.includes('.') &&  // Remove any remaining sentences
              label.split(' ').length <= 3  // Limit to 3 words max per label
            )

          return {
            promptId: prompt.id,
            promptText: prompt.promptText,
            labels: cleanedLabels
          }
        } catch (err) {
          const promptError = err as Error
          console.error('Error processing individual prompt:', {
            promptName: prompt.name,
            error: promptError
          })
          throw promptError
        }
      }))

      res.json(results)
    } catch (err) {
      const apiError = err as Error
      console.error('OpenAI API Error:', apiError)
      throw apiError
    }
  } catch (err) {
    const error = err as Error
    console.error('Server Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
    res.status(500).json({ 
      error: 'Failed to generate labels',
      details: error.message
    })
  }
})

// Update the stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await prisma.prompt.findMany({
      select: {
        name: true,
        _count: {
          select: {
            votes: true
          }
        },
        votes: {
          select: {
            score: true
          }
        }
      }
    })

    const summary = stats.map((prompt: { name: string; votes: { score: string }[] }) => {
      const goodVotes = prompt.votes.filter((v: { score: string }) => v.score === 'good').length
      const okVotes = prompt.votes.filter((v: { score: string }) => v.score === 'ok').length
      const badVotes = prompt.votes.filter((v: { score: string }) => v.score === 'bad').length
      const total = prompt.votes.length

      return {
        prompt: prompt.name,
        total,
        distribution: {
          good: `${goodVotes} (${Math.round((goodVotes/total) * 100)}%)`,
          ok: `${okVotes} (${Math.round((okVotes/total) * 100)}%)`,
          bad: `${badVotes} (${Math.round((badVotes/total) * 100)}%)`
        }
      }
    })

    res.json(summary)
  } catch (err) {
    const error = err as Error
    res.status(500).json({ error: 'Failed to fetch statistics', details: error.message })
  }
})

const port = 3000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
}) 