import { PromptData } from '../../types/index'
import {
  RankingsContainer,
  RankingCard,
  ProgressBar,
  Score,
  PromptName,
  Stats
} from './PromptRankings.styles'

interface PromptRankingsProps {
  prompts: PromptData[]
  showRankings: boolean
}

export const PromptRankings = ({ prompts, showRankings }: PromptRankingsProps) => {
  if (!prompts.length || !showRankings) return null

  return (
    <RankingsContainer>
      {prompts.map((prompt) => (
        <RankingCard key={prompt.id}>
          <PromptName>{prompt.name}</PromptName>
          <Stats>
            <Score>Good: {prompt.votes.good}</Score>
            <Score>OK: {prompt.votes.ok}</Score>
            <Score>Bad: {prompt.votes.bad}</Score>
            <Score>Total: {prompt.totalVotes}</Score>
          </Stats>
          <ProgressBar>
            <div 
              style={{ 
                width: `${prompt.percentages.good}%`,
                backgroundColor: '#22c55e'
              }} 
            />
            <div 
              style={{ 
                width: `${prompt.percentages.ok}%`,
                backgroundColor: '#eab308'
              }} 
            />
            <div 
              style={{ 
                width: `${prompt.percentages.bad}%`,
                backgroundColor: '#ef4444'
              }} 
            />
          </ProgressBar>
        </RankingCard>
      ))}
    </RankingsContainer>
  )
} 