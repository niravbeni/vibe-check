import { useState, useEffect } from 'react'
import { CustomImageData, PromptData, LabelCategories } from './types/index'
import { ImageContainer } from './components/ImageContainer/ImageContainer'
import { Container, GenerateButton, TitleCheckmark, LoadingBar, SuccessCheckmark } from './App.styles'
import { GlobalStyles } from './styles/GlobalStyles'
import { ButtonCard } from './components/EvaluationCard/EvaluationCard'
import { PromptRankings } from './components/PromptRankings/PromptRankings'
import { API_URL } from './config'

function App() {
  const [images, setImages] = useState<CustomImageData[]>([
    { url: '', base64: '' },
    { url: '', base64: '' },
    { url: '', base64: '' }
  ])
  const [labelCategories, setLabelCategories] = useState<LabelCategories>({
    mood: [],
    style: [],
    colors: [],
    materials: [],
    aesthetic: []
  })
  const [showResults, setShowResults] = useState(false)
  const [promptData, setPromptData] = useState<PromptData | null>(null)
  const [showRankings, setShowRankings] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Fetch prompt data when component mounts
  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const response = await fetch(`${API_URL}/api/prompts`)
        if (!response.ok) throw new Error('Failed to fetch prompt')
        const prompts = await response.json()
        
        // Check if we have any prompts
        if (!prompts || !prompts.length) {
          console.error('No prompts found in the response')
          return
        }
        
        setPromptData(prompts[0]) // Get the single prompt
      } catch (error) {
        console.error('Error fetching prompt:', error)
      }
    }

    fetchPrompt()
  }, [])

  const handleImageUpload = async (files: File[], index: number) => {
    const file = files[0]
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

  const handleVote = async (score: string) => {
    if (!promptData) return

    try {
      const response = await fetch(`${API_URL}/api/prompts/${promptData.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ score })
      })

      if (!response.ok) throw new Error('Failed to submit vote')

      // Fetch updated prompt data
      const updatedPrompt = await fetch(`${API_URL}/api/prompts`)
      if (!updatedPrompt.ok) throw new Error('Failed to fetch updated prompt')
      
      const prompts = await updatedPrompt.json()
      if (!prompts || !prompts.length) {
        console.error('No prompts found in the response')
        return
      }
      
      setPromptData(prompts[0])
      setShowResults(true)  // Show thank you message instead of rankings
    } catch (error) {
      console.error('Error submitting vote:', error)
    }
  }

  const handleImageDelete = (index: number) => {
    const newImages = [...images]
    newImages[index] = { url: '', base64: '' }
    setImages(newImages)
  }

  const generateLabels = async () => {
    try {
      console.log('Sending images to generate labels:', images)
      const response = await fetch(`${API_URL}/api/generate-labels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ images })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server error:', errorText)
        throw new Error('Failed to generate labels')
      }

      const data = await response.json()
      console.log('Received label data:', data)
      
      if (!data.categories) {
        console.error('No categories found in response:', data)
        throw new Error('Invalid response format')
      }
      
      setLabelCategories(data.categories)
      setShowResults(false) // Keep showing the ButtonCard instead of success message
    } catch (error) {
      console.error('Error generating labels:', error)
      setIsGenerating(false)
      throw error
    }
  }

  // Helper function to get total number of labels
  const totalLabels = Object.values(labelCategories).reduce((sum, arr) => sum + arr.length, 0)

  const handleStart = async () => {
    setIsGenerating(true)
    try {
      await generateLabels()
    } catch (error) {
      console.error('Error starting the process:', error)
      alert('Failed to generate labels. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRefresh = () => {
    window.location.reload();
  }

  return (
    <>
      <GlobalStyles />
      <Container>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h1>Vibe Check</h1>
          <TitleCheckmark
            onClick={() => setShowRankings(!showRankings)}
            title={showRankings ? "Hide rankings" : "Show rankings"}
          >
            ✅
          </TitleCheckmark>
        </div>
        
        {promptData && <PromptRankings prompt={promptData} showRankings={showRankings} />}
        
        <ImageContainer 
          images={images}
          onImageUpload={!totalLabels ? handleImageUpload : undefined}
          onImageDelete={!totalLabels ? handleImageDelete : undefined}
        />

        {!totalLabels && !isGenerating && (
          <GenerateButton 
            onClick={handleStart}
            disabled={!images.every(img => img.url)}
          >
            {!images.every(img => img.url) ? 'Upload Images!' : 'Start'}
          </GenerateButton>
        )}

        {isGenerating && (
          <LoadingBar />
        )}

        {totalLabels > 0 && !showResults && promptData && (
          <ButtonCard
            labelCategories={labelCategories}
            onEvaluate={handleVote}
            isLoading={false}
            isFinalPrompt={true}
          />
        )}

        {showResults && (
          <div style={{ 
            textAlign: 'center', 
            marginTop: '3rem',
            color: 'white',
            paddingBottom: '2rem'
          }}>
            <SuccessCheckmark onClick={handleRefresh} style={{ cursor: 'pointer' }} />
            <h2>Thank you for your feedback!</h2>
            <p>Your responses have been recorded.</p>
          </div>
        )}
      </Container>
    </>
  )
}

export default App