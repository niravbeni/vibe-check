import { useState } from 'react'
import { PromptData } from '../../types/index'
import {
  RankingsContainer,
  RankingCard,
  ProgressBar,
  Score,
  Stats,
  ResetButton
} from './PromptRankings.styles'
import { API_URL } from '../../config'

interface PromptRankingsProps {
  prompt: PromptData
  showRankings: boolean
}

export const PromptRankings = ({ prompt, showRankings }: PromptRankingsProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!showRankings) return null

  const handleResetClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmReset = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reset-votes`, {
        method: 'POST',
      });
      
      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Failed to reset votes');
      }
    } catch (error) {
      console.error('Error resetting votes:', error);
    }
    setShowConfirmation(false);
  };

  return (
    <RankingsContainer>
      <RankingCard>
        <Stats>
          <Score>Good: {prompt.votes.good}</Score>
          <Score>OK: {prompt.votes.ok}</Score>
          <Score>Bad: {prompt.votes.bad}</Score>
          <Score>Total: {prompt.totalVotes}</Score>
          <ResetButton onClick={handleResetClick}>
            🔄 Reset
          </ResetButton>
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

        {showConfirmation && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <h3 style={{ marginBottom: '1rem' }}>Reset All Votes?</h3>
              <p style={{ marginBottom: '1.5rem' }}>This will set all vote counts to zero.</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={() => setShowConfirmation(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    background: 'white'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReset}
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '6px',
                    background: '#C62828',
                    color: 'white'
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </RankingCard>
    </RankingsContainer>
  )
} 