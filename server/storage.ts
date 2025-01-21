import fs from 'fs/promises'
import path from 'path'
import { PROMPTS } from '../src/config/prompts'
import { Prompt, Score } from './types'

interface StorageData {
  prompts: Prompt[];
}

const DATA_FILE = path.join(__dirname, 'storage', 'data.json')

async function readData(): Promise<StorageData> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    // Initialize with default prompts
    const data = { prompts: PROMPTS.map(p => ({ ...p, votes: { good: 0, ok: 0, bad: 0 } })) }
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    return data
  }
}

export async function getPrompts(): Promise<Prompt[]> {
  const data = await readData()
  return data.prompts
}

export async function saveVote(promptId: string, score: Score): Promise<void> {
  const data = await readData()
  const prompt = data.prompts.find(p => p.id === promptId)
  if (prompt) {
    prompt.votes[score]++
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
  }
} 