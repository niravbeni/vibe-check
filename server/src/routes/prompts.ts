import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// Get prompt data
router.get('/prompts', async (req, res) => {
  try {
    const prompts = await prisma.prompt.findMany()
    res.json({ prompts })
  } catch (err) {
    console.error('Error fetching prompts:', err)
    res.status(500).json({ error: 'Failed to fetch prompts' })
  }
})

// Submit vote
router.post('/prompts/:id/vote', async (req, res) => {
  try {
    const { id } = req.params
    const { score } = req.body

    const prompt = await prisma.prompt.findUnique({
      where: { id: parseInt(id) }
    })

    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' })
    }

    const votes = JSON.parse(JSON.stringify(prompt.votes))
    votes[score]++
    const totalVotes = prompt.totalVotes + 1

    // Calculate new percentages
    const percentages = {
      good: Math.round((votes.good / totalVotes) * 100),
      ok: Math.round((votes.ok / totalVotes) * 100),
      bad: Math.round((votes.bad / totalVotes) * 100)
    }

    await prisma.prompt.update({
      where: { id: parseInt(id) },
      data: {
        votes,
        totalVotes,
        percentages
      }
    })

    res.json({ success: true })
  } catch (err) {
    console.error('Error submitting vote:', err)
    res.status(500).json({ error: 'Failed to submit vote' })
  }
})

export default router 