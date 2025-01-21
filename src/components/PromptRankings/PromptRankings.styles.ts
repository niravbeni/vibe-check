import styled from 'styled-components'

export const RankingsContainer = styled.div`
  margin: 2rem auto;
  max-width: 600px;
  padding: 1rem;
`

export const RankingCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

export const ToggleButton = styled.button`
  background: #4b5563;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin: 1rem 0;

  &:hover {
    background: #374151;
  }
`

export const ProgressBar = styled.div`
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;

  > div {
    transition: width 0.3s ease;
  }
`

export const Score = styled.span`
  margin-right: 1rem;
  font-size: 0.875rem;
  color: #4b5563;
`

export const PromptName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #111827;
`

export const Stats = styled.div`
  margin-bottom: 0.5rem;
` 