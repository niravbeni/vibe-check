import { Router } from 'express'
import OpenAI from 'openai'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const router = Router()

console.log('Environment variables:', {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'Set' : 'Not set',
  DATABASE_URL: process.env.DATABASE_URL
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ImageData {
  base64: string;
  url: string;
}

type ImageURL = {
  url: string;
  detail?: 'low' | 'high' | 'auto';
}

type ChatCompletionContentPart = {
  type: 'text';
  text: string;
} | {
  type: 'image_url';
  image_url: ImageURL;
}

interface LabelCategories {
  mood: string[];
  style: string[];
  colors: string[];
  materials: string[];
  aesthetic: string[];
}

router.post('/', async (req, res) => {
  try {
    console.log('Generating labels...')
    const { images } = req.body as { images: ImageData[] }

    if (!images || images.length !== 3) {
      console.error('Invalid request: Incorrect number of images')
      return res.status(400).json({ error: 'Exactly 3 images are required' })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found')
      return res.status(500).json({ error: 'OpenAI API key not configured' })
    }

    console.log('Sending request to OpenAI...')
    const messages = [
      {
        role: "system" as const,
        content: "You are a comprehensive style analyzer. Analyze the images and provide categorized labels in this exact format:\n\
MOOD: label1, label2, label3\n\
STYLE: label1, label2, label3\n\
COLORS: label1, label2, label3\n\
MATERIALS: label1, label2, label3\n\
AESTHETIC: label1, label2, label3\n\
\n\
IMPORTANT RULES:\n\
- Each category MUST start with the exact category name in caps followed by colon\n\
- Within each category, use ONLY single words or hyphenated terms (e.g., 'minimalist', 'earth-toned', 'silk-blend')\n\
- NO phrases or full sentences\n\
- NO image numbering or prefixes\n\
- Separate labels within categories with commas\n\
\n\
GOOD EXAMPLES:\n\
MOOD: minimalist, serene, sophisticated\n\
STYLE: luxury, contemporary, high-end\n\
COLORS: earth-toned, cream, charcoal-grey\n\
MATERIALS: silk-blend, wool, textured-cotton\n\
AESTHETIC: tailored, urban-chic, structured"
      },
      {
        role: "user" as const,
        content: [
          {
            type: "text" as const,
            text: "Analyze these images and provide categorized style labels. Use only single words or hyphenated terms."
          },
          ...images.map(img => ({
            type: "image_url" as const,
            image_url: {
              url: `data:image/jpeg;base64,${img.base64}`,
              detail: "auto"
            }
          }))
        ] as ChatCompletionContentPart[]
      }
    ]

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 150
    })

    const labelsText = response.choices[0]?.message?.content || ''
    
    // Parse the categorized labels
    const categories: LabelCategories = {
      mood: [],
      style: [],
      colors: [],
      materials: [],
      aesthetic: []
    }

    const lines = labelsText.split('\n')
    lines.forEach(line => {
      const [category, labels] = line.split(':')
      if (labels) {
        const categoryKey = category.trim().toLowerCase() as keyof LabelCategories
        if (categoryKey in categories) {
          categories[categoryKey] = labels.split(',').map(label => label.trim()).filter(Boolean)
        }
      }
    })

    res.json({ categories })
  } catch (error) {
    console.error('Error generating labels:', error)
    res.status(500).json({ error: 'Failed to generate labels', details: error.message })
  }
})

export default router 