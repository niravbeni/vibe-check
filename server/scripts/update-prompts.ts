import prisma from '../lib/prisma'
import { PROMPTS } from '../../src/config/prompts'

async function main() {
  for (const prompt of PROMPTS) {
    await prisma.prompt.upsert({
      where: { id: prompt.id },
      update: {
        name: prompt.name,
        promptText: prompt.promptText,
        systemPrompt: prompt.systemPrompt
      },
      create: {
        id: prompt.id,
        name: prompt.name,
        promptText: prompt.promptText,
        systemPrompt: prompt.systemPrompt
      }
    })
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 