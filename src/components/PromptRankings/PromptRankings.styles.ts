import styled from 'styled-components'

export const RankingsContainer = styled.div`
  margin: 0.5rem auto;
  width: 100%;
  padding: 0.25rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  justify-content: center;
`

export const ScrollContainer = styled.div`
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 0.5rem 2rem;
  -ms-overflow-style: none;  /* Hide scrollbar IE and Edge */
  scrollbar-width: none;  /* Hide scrollbar Firefox */

  &::-webkit-scrollbar {
    display: none;  /* Hide scrollbar Chrome, Safari, Opera */
  }
`

export const ScrollButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${props => props.direction === 'left' ? 'left: 0' : 'right: 0'};
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;

  &:hover {
    background-color: white;
  }

  &::before {
    content: ${props => props.direction === 'left' ? '"←"' : '"→"'};
    color: #4b5563;
    font-size: 1.2rem;
  }
`

export const RankingCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 240px;
  max-width: 280px;
`

export const ProgressBar = styled.div`
  display: flex;
  height: 6px;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;

  > div {
    transition: width 0.3s ease;
  }
`

export const Score = styled.span`
  margin-right: 0.75rem;
  font-size: 0.8rem;
  color: #4b5563;
`

export const PromptName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #111827;
  font-size: 0.9rem;
`

export const Stats = styled.div`
  margin-bottom: 0.5rem;
` 