import { useState, useEffect } from 'react'
import { PromptResult, Evaluation } from './types'
import { ImageContainer } from './components/ImageContainer/ImageContainer'
import { Container, GenerateButton } from './App.styles'
import { Prompt } from './config/prompts'
import { GlobalStyles } from './styles/GlobalStyles'
import { ButtonCard } from './components/EvaluationCard/EvaluationCard'
import { PromptRankings } from './components/PromptRankings/PromptRankings'

// Define the ImageData type here or in a separate types file
interface ImageData {
  url: string;
  base64: string;
}

function App() {
  const [images, setImages] = useState<ImageData[]>([
    { url: '', base64: '' },
    { url: '', base64: '' },
    { url: '', base64: '' }
  ])
  const [promptResults, setPromptResults] = useState<PromptResult[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true)
  const [promptsData, setPromptsData] = useState<any[]>([])

  // Fetch prompts when component mounts
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setIsLoadingPrompts(true)
        const response = await fetch('http://localhost:3000/api/prompts')
        if (!response.ok) {
          throw new Error('Failed to fetch prompts')
        }
        const data = await response.json()
        setPrompts(data.prompts)
        setPromptsData(data.prompts)
      } catch (error) {
        console.error('Error fetching prompts:', error)
      } finally {
        setIsLoadingPrompts(false)
      }
    }

    fetchPrompts()
  }, [])

  const handleImageUpload = async (files: File[], index: number) => {
    const file = files[0] // Take the first file if multiple are dropped
    if (file) {
      try {
        const base64String = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            const result = reader.result as string
            const base64 = result.split(',')[1]
            resolve(base64)
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        const newImages = [...images]
        newImages[index] = { 
          url: URL.createObjectURL(file),
          base64: base64String
        }
        setImages(newImages)
      } catch (error) {
        console.error('Error processing image:', error)
        alert('Error processing image. Please try again.')
      }
    }
  }

  const fetchPromptRankings = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/prompts')
      if (!response.ok) {
        throw new Error('Failed to fetch prompts')
      }
      const data = await response.json()
      setPromptsData(data.prompts)
    } catch (error) {
      console.error('Error fetching prompt rankings:', error)
    }
  }

  const handleEvaluation = async (score: 'good' | 'bad' | 'ok') => {
    try {
      const promptId = promptResults[currentIndex].promptId
      console.log('Submitting vote:', { promptId, score })

      const response = await fetch(`http://localhost:3000/api/prompts/${promptId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit vote')
      }

      // Fetch updated rankings
      await fetchPromptRankings()

      if (currentIndex < promptResults.length - 1) {
        setCurrentIndex(prev => prev + 1)
      } else {
        setShowResults(true)
      }
    } catch (error) {
      console.error('Error submitting evaluation:', error)
      alert('Error submitting vote. Please try again.')
    }
  }

  const handleImageDelete = (index: number) => {
    const newImages = [...images]
    newImages[index] = { url: '', base64: '' }
    setImages(newImages)
  }

  const generateLabels = async () => {
    try {
      console.log('Starting label generation...')
      const loadedImages = await Promise.all(
        images.map(async img => {
          if (!img.url) return img
          try {
            const response = await fetch(img.url)
            const blob = await response.blob()
            const base64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = () => {
                if (typeof reader.result === 'string') {
                  // Keep the full data URL
                  resolve(reader.result)
                }
              }
              reader.onerror = reject
              reader.readAsDataURL(blob)
            })
            return { ...img, base64 }
          } catch (error) {
            console.error('Error processing image:', error)
            throw new Error('Failed to process image')
          }
        })
      )

      console.log('Images processed, sending to server...', {
        numberOfImages: loadedImages.length,
        hasBase64: loadedImages.every(img => img.base64),
        firstImageLength: loadedImages[0]?.base64?.length
      })

      const response = await fetch('http://localhost:3000/api/generate-labels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: loadedImages })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to generate labels: ${errorData.error || response.statusText}`)
      }
      
      const results = await response.json()
      console.log('Labels generated successfully:', results)
      setPromptResults(results)
    } catch (error) {
      console.error('Detailed error generating labels:', error)
      alert('Error generating labels. Please try again.')
    }
  }

  const handleStart = async () => {
    setIsGenerating(true)
    try {
      await generateLabels()
    } catch (error) {
      console.error('Error starting the process:', error)
    }
    setIsGenerating(false)
  }

  return (
    <>
      <GlobalStyles />
      <Container>
        <h1>Vibe Check</h1>
        
        <PromptRankings prompts={promptsData} />
        
        <ImageContainer 
          images={images}
          onImageUpload={!promptResults.length ? handleImageUpload : undefined}
          onImageDelete={!promptResults.length ? handleImageDelete : undefined}
        />

        {!promptResults.length && (
          <GenerateButton 
            onClick={handleStart}
            disabled={isGenerating || !images.every(img => img.url)}
          >
            {isGenerating ? 'Generating...' : 
             !images.every(img => img.url) ? 'Upload Images' : 'Start'}
          </GenerateButton>
        )}

        {promptResults.length > 0 && !showResults && (
          <ButtonCard
            name={prompts?.find(p => p.id === promptResults[currentIndex]?.promptId)?.name || ''}
            promptText={promptResults[currentIndex]?.promptText || ''}
            labels={promptResults[currentIndex]?.labels || []}
            onEvaluate={handleEvaluation}
            isLoading={false}
            isFinalPrompt={currentIndex === promptResults.length - 1}
          />
        )}

        {showResults && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: 'white',
              fontSize: '2.5rem'
            }}>
              ✓
            </div>
            <h2>Thank you for your feedback!</h2>
            <p>Your responses have been recorded.</p>
          </div>
        )}
      </Container>
    </>
  )
}

export default App