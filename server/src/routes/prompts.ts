import { Router } from 'express'
import type { PrismaClient } from '@prisma/client'
import prisma from '../../lib/prisma.js'

const router = Router()

interface PromptWithCounts {
  id: number
  name: string
  promptText: string
  votes: {
    good: number
    ok: number
    bad: number
  }
  percentages: {
    good: number
    ok: number
    bad: number
  }
  totalVotes: number
  summary: string
}

interface VoteUpdateData {
  goodVotes?: number
  okVotes?: number
  badVotes?: number
  totalVotes: number
  goodPercentage: number
  okPercentage: number
  badPercentage: number
}

type PromptFromDB = NonNullable<Awaited<ReturnType<PrismaClient['prompt']['findUnique']>>>

// Get all prompts with their vote counts
router.get('/', async (req, res) => {
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
        badPercentage: true,
      }
    })
    
    console.log(`Found ${prompts.length} prompts`)
    res.json(prompts)
  } catch (error) {
    console.error('Error fetching prompts:', error)
    res.status(500).json({ error: 'Failed to fetch prompts', details: error.message })
  }
})

// Update the vote endpoint
router.post('/:promptId/vote', async (req, res) => {
  const { promptId } = req.params
  const { score } = req.body

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
      goodVotes: score === 'good' ? prompt.goodVotes + 1 : prompt.goodVotes,
      okVotes: score === 'ok' ? prompt.okVotes + 1 : prompt.okVotes,
      badVotes: score === 'bad' ? prompt.badVotes + 1 : prompt.badVotes,
      totalVotes: newTotalVotes,
      goodPercentage: 0,
      okPercentage: 0,
      badPercentage: 0
    }

    // Calculate new percentages
    const goodVotes = data.goodVotes || 0
    const okVotes = data.okVotes || 0
    const badVotes = data.badVotes || 0

    data.goodPercentage = Math.round((goodVotes / newTotalVotes) * 100)
    data.okPercentage = Math.round((okVotes / newTotalVotes) * 100)
    data.badPercentage = Math.round((badVotes / newTotalVotes) * 100)

    // Update the prompt
    const updatedPrompt = await prisma.prompt.update({
      where: { id: parseInt(promptId) },
      data
    })

    res.json({ success: true, prompt: updatedPrompt })
  } catch (error) {
    console.error('Vote creation error:', error)
    res.status(500).json({ 
      error: 'Failed to record vote',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export default router 