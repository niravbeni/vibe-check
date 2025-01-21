import express from 'express'
import OpenAI from 'openai'
import cors from 'cors'
import dotenv from 'dotenv'
import prisma from './lib/prisma'
import { type PrismaClient } from '@prisma/client'

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

type Vote = NonNullable<Awaited<ReturnType<PrismaClient['vote']['findFirst']>>>
type PromptWithVotes = NonNullable<Awaited<ReturnType<PrismaClient['prompt']['findFirst']>> & {
  votes: Vote[]
}>

// Get all prompts with their vote counts
app.get('/api/prompts', async (req, res) => {
  try {
    const prompts = await prisma.prompt.findMany({
      include: {
        votes: true
      }
    })

    // Transform the data to include vote counts
    const promptsWithCounts = prompts.map((prompt: PromptWithVotes) => ({
      id: prompt.id,
      name: prompt.name,
      promptText: prompt.promptText,
      systemPrompt: prompt.systemPrompt,
      votes: {
        good: prompt.votes.filter((v: Vote) => v.score === 'good').length,
        ok: prompt.votes.filter((v: Vote) => v.score === 'ok').length,
        bad: prompt.votes.filter((v: Vote) => v.score === 'bad').length
      }
    }))

    res.json(promptsWithCounts)
  } catch (error) {
    console.error('Error fetching prompts:', error)
    res.status(500).json({ error: 'Failed to fetch prompts' })
  }
})

// Add a vote for a prompt
app.post('/api/prompts/:promptId/vote', async (req, res) => {
  const { promptId } = req.params
  const { score } = req.body

  try {
    await prisma.vote.create({
      data: {
        promptId,
        score
      }
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Error adding vote:', error)
    res.status(500).json({ error: 'Failed to add vote' })
  }
})

// Add type for the prompt parameter
type PromptWithSystem = {
  id: string;
  promptText: string;
  systemPrompt?: string;
}

// Add interface for OpenAI error type
interface OpenAIError extends Error {
  response?: {
    data?: unknown;
    status?: number;
  };
}

app.post('/api/generate-labels', async (req, res) => {
  try {
    const { images } = req.body
    
    console.log('Server received request:', {
      numberOfImages: images?.length || 0,
      hasImages: !!images
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
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: prompt.systemPrompt || "You are a helpful assistant that analyzes images. Provide ONLY comma-separated labels without any formatting, numbering, or categorization. For example: 'casual, minimalist, white shirt, elegant, modern'"
            },
            {
              role: "user",
              content: [
                { 
                  type: "text", 
                  text: prompt.promptText || "Analyze these images and provide a simple comma-separated list of relevant labels. DO NOT format the response or add categories. Just provide labels separated by commas." 
                },
                ...images.map((img: { base64: string }) => ({  // Specify type instead of any
                  type: "image_url",
                  image_url: {
                    url: img.base64.startsWith('data:image') 
                      ? img.base64 
                      : `data:image/jpeg;base64,${img.base64}`
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
          .replace(/First Image:|Second Image:|Third Image:/gi, '')
          .replace(/[-•]/g, ',')
          .split(',')
          .map(label => label.trim())
          .filter(label => label.length > 0)

        return {
          promptId: prompt.id,
          promptText: prompt.promptText,
          labels: cleanedLabels
        }
      }))

      res.json(results)
    } catch (error: unknown) {
      // Type guard for OpenAI error
      if (error instanceof Error) {
        const openaiError = error as OpenAIError
        console.error('OpenAI API Error:', {
          message: openaiError.message,
          response: openaiError.response?.data
        })
        throw new Error(`OpenAI API error: ${openaiError.message}`)
      } else {
        console.error('Unknown error:', error)
        throw new Error('An unknown error occurred')
      }
    }
  } catch (error) {
    console.error('Server Error:', error)
    res.status(500).json({ error: 'Failed to generate labels' })
  }
})

const port = 3000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
}) 