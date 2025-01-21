import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    // Clear existing data first
    console.log('Clearing existing data...')
    await prisma.vote.deleteMany({
      where: {}
    })
    await prisma.prompt.deleteMany({
      where: {}
    })

    console.log('Creating prompts...')
    
    // Create prompts one by one to ensure order
    await prisma.prompt.create({
      data: {
        name: "A - Style",
        promptText: "Analyze style elements and fashion characteristics",
        systemPrompt: "You are a fashion expert. Provide style-related labels."
      }
    })

    await prisma.prompt.create({
      data: {
        name: "B - Mood",
        promptText: "Analyze mood and emotional qualities",
        systemPrompt: "You are a mood expert. Provide emotional and atmospheric labels."
      }
    })

    await prisma.prompt.create({
      data: {
        name: "C - Brand",
        promptText: "Analyze brand alignment and market fit",
        systemPrompt: "You are a brand expert. Provide brand-related labels."
      }
    })

    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('Failed to seed database:', e)
    process.exit(1)
  })