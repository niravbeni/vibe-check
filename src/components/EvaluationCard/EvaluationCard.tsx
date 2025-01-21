import React, { useState, useEffect } from 'react'
import { 
  CardContainer, 
  Card, 
  PromptName,
  LabelsList,
  Label,
  ButtonsContainer,
  ActionButton,
  SubmitButton
} from './EvaluationCard.styles'

interface ButtonCardProps {
  name: string
  promptText: string  // We'll keep this in the props but not display it
  labels: string[]
  onEvaluate: (score: 'good' | 'bad' | 'ok') => void
  isLoading?: boolean
  isFinalPrompt?: boolean
}

export const ButtonCard: React.FC<ButtonCardProps> = ({ 
  name, 
  labels, 
  onEvaluate,
  isLoading,
  isFinalPrompt
}) => {
  const [selectedScore, setSelectedScore] = useState<'good' | 'bad' | 'ok' | null>(null)

  // Reset selection when prompt changes
  useEffect(() => {
    setSelectedScore(null)
  }, [name, labels]) // Reset when prompt content changes

  return (
    <CardContainer>
      <Card>
        <PromptName>{name}</PromptName>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Generating labels...
          </div>
        ) : (
          <>
            <LabelsList>
              {labels.map((label, index) => (
                <Label key={index}>{label}</Label>
              ))}
            </LabelsList>
            <ButtonsContainer>
              <ActionButton 
                onClick={() => setSelectedScore('bad')} 
                $variant="bad"
                $selected={selectedScore === 'bad'}
              >
                👎 Bad
              </ActionButton>
              <ActionButton 
                onClick={() => setSelectedScore('ok')} 
                $variant="ok"
                $selected={selectedScore === 'ok'}
              >
                😐 Okay
              </ActionButton>
              <ActionButton 
                onClick={() => setSelectedScore('good')} 
                $variant="good"
                $selected={selectedScore === 'good'}
              >
                👍 Good
              </ActionButton>
            </ButtonsContainer>
            <SubmitButton 
              onClick={() => selectedScore && onEvaluate(selectedScore)}
              disabled={!selectedScore}
              $isFinal={isFinalPrompt}
              aria-label={isFinalPrompt ? "Submit final rating" : "Submit and continue"}
            />
          </>
        )}
      </Card>
    </CardContainer>
  )
} 