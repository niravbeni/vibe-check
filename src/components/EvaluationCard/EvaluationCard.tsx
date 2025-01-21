import React, { useState, useEffect } from 'react'
import { 
  CardContainer, 
  Card, 
  InstructionText,
  LabelsList,
  Label,
  ButtonsContainer,
  ActionButton,
  SubmitButton,
} from './EvaluationCard.styles'

interface ButtonCardProps {
  labels: string[];
  onEvaluate: (score: 'good' | 'bad' | 'ok') => void;
  isLoading: boolean;
  isFinalPrompt: boolean;
}

export const ButtonCard: React.FC<ButtonCardProps> = ({ 
  labels, 
  onEvaluate,
  isFinalPrompt
}) => {
  const [selectedScore, setSelectedScore] = useState<'good' | 'bad' | 'ok' | null>(null)

  // Reset selection when labels change
  useEffect(() => {
    setSelectedScore(null)
  }, [labels])

  return (
    <CardContainer>
      <Card>
        <InstructionText>
          Please rate how accurately these labels capture your images and inspiration.
        </InstructionText>
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
          aria-label="Submit rating"
        />
      </Card>
    </CardContainer>
  )
} 