import { LabelCategories } from '../../types/index'
import { useState, useEffect } from 'react'
import {
  CardContainer,
  Card,
  Label,
  ButtonGroup,
  EvalButton,
  SubmitButton,
  LabelsList,
  CategoryKey,
  CategoryItem,
  ColorDot
} from './EvaluationCard.styles'

interface ButtonCardProps {
  labelCategories: LabelCategories;
  onEvaluate: (score: 'good' | 'bad' | 'ok') => void;
  isLoading: boolean;
  isFinalPrompt: boolean;
}

export const ButtonCard = ({ labelCategories, onEvaluate, isLoading, isFinalPrompt }: ButtonCardProps) => {
  const [selectedScore, setSelectedScore] = useState<'good' | 'bad' | 'ok' | null>(null);
  const categories = ['mood', 'style', 'colors', 'materials', 'aesthetic'] as const;
  const displayNames = {
    mood: 'Mood',
    style: 'Style',
    colors: 'Colors',
    materials: 'Materials',
    aesthetic: 'Aesthetic'
  };

  // Map old category names to new ones
  const categoryMapping = {
    mood: 'mood',
    brand: 'style',
    colors: 'colors',
    materials: 'materials',
    aesthetics: 'aesthetic'
  };
  
  // Reset selection when labels change
  useEffect(() => {
    setSelectedScore(null);
  }, [labelCategories]);

  // Create flat array of labels with their categories, mapping old categories to new ones
  const allLabels = Object.entries(labelCategories).flatMap(([oldCategory, labels]: [string, string[]]) => 
    (labels || []).map(label => ({
      label,
      category: categoryMapping[oldCategory as keyof typeof categoryMapping] || oldCategory
    }))
  );

  return (
    <CardContainer>
      <Card>
        <CategoryKey>
          {categories.map(category => (
            <CategoryItem key={category}>
              <ColorDot $category={category} />
              {displayNames[category]}
            </CategoryItem>
          ))}
        </CategoryKey>

        <LabelsList>
          {allLabels.map(({ label, category }, index) => (
            <Label key={`${category}-${index}`} $category={category}>
              {label}
            </Label>
          ))}
        </LabelsList>

        <ButtonGroup>
          <EvalButton 
            onClick={() => setSelectedScore('good')} 
            disabled={isLoading} 
            color="green"
            aria-selected={selectedScore === 'good'}
          >
            👍 Good
          </EvalButton>
          <EvalButton 
            onClick={() => setSelectedScore('ok')} 
            disabled={isLoading} 
            color="yellow"
            aria-selected={selectedScore === 'ok'}
          >
            👌 OK
          </EvalButton>
          <EvalButton 
            onClick={() => setSelectedScore('bad')} 
            disabled={isLoading} 
            color="red"
            aria-selected={selectedScore === 'bad'}
          >
            👎 Bad
          </EvalButton>
        </ButtonGroup>

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