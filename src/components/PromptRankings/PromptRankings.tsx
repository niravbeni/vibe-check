import { useState } from 'react'
import { 
  RankingsContainer, 
  RankingCard, 
  ToggleButton,
  ProgressBar,
  Score,
  PromptName,
  Stats
} from './PromptRankings.styles'

interface RankingsProps {
  prompts: {
    name: string;
    votes: {
      good: number;
      ok: number;
      bad: number;
    };
    percentages: {
      good: number;
      ok: number;
      bad: number;
    };
    totalVotes: number;
  }[];
}

export const PromptRankings = ({ prompts }: RankingsProps) => {
  const [showRankings, setShowRankings] = useState(false)

  if (!showRankings) {
    return (
      <ToggleButton onClick={() => setShowRankings(true)}>
        Show Prompt Rankings
      </ToggleButton>
    )
  }

  return (
    <RankingsContainer>
      <ToggleButton onClick={() => setShowRankings(false)}>
        Hide Rankings
      </ToggleButton>
      {prompts.map((prompt, index) => (
        <RankingCard key={index}>
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