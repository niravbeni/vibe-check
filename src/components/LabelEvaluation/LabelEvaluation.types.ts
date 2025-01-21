import { PromptResult, Score } from '../../types'

export interface LabelEvaluationProps {
  promptResult: PromptResult
  currentIndex: number
  totalPrompts: number
  onEvaluate: (score: Score) => void
} 