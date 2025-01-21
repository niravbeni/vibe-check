import { Router } from 'express'
import OpenAI from 'openai'

const router = Router()

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

router.post('/generate-labels', async (req, res) => {
  try {
    const { images } = req.body as { images: ImageData[] }

    if (!images || images.length !== 3) {
      throw new Error('Exactly 3 images are required')
    }

    const messages = [
      {
        role: "system" as const,
        content: "You are a comprehensive style analyzer. Analyze the images and provide relevant labels that capture the overall mood, style, theme, and brand essence. Return only the labels as a comma-separated list."
      },
      {
        role: "user" as const,
        content: [
          {
            type: "text" as const,
            text: "Analyze these images and provide relevant style labels."
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
    const labels = labelsText.split(',').map((label: string) => label.trim())

    res.json({ labels })
  } catch (error) {
    console.error('Error generating labels:', error)
    res.status(500).json({ error: 'Failed to generate labels' })
  }
})

export default router 