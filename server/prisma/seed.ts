import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    // Clear existing data
    await prisma.prompt.deleteMany()

    // Create single comprehensive prompt
    await prisma.prompt.create({
      data: {
        id: 1,
        name: "General Vibe Check",
        promptText: "How well do these labels capture the overall mood, style, and theme of your images?",
        goodVotes: 0,
        okVotes: 0,
        badVotes: 0,
        totalVotes: 0,
        goodPercentage: 0,
        okPercentage: 0,
        badPercentage: 0
      }
    })

    console.log('Database has been seeded')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('Failed to seed database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })