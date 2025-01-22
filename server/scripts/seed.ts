import prisma from '../lib/prisma.js'
import { PROMPTS } from '../src/prompts.js'

async function main() {
  for (const prompt of PROMPTS) {
    await prisma.prompt.create({
      data: {
        name: prompt.name,
        promptText: prompt.promptText,
        goodVotes: 0,
        okVotes: 0,
        badVotes: 0,
        totalVotes: 0,
        goodPercentage: 0,
        okPercentage: 0,
        badPercentage: 0
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