import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding-top: 4rem;

  h1 {
    color: white;
    font-size: 2rem;
    margin-bottom: 2rem;
    font-weight: 700;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &::after {
      content: '✅';
      font-size: 1.75rem;
    }
  }
`

export const GenerateButton = styled.button<{ disabled?: boolean }>`
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
  border-radius: 8px;
  border: none;
  background-color: ${props => props.disabled ? '#cbd5e1' : '#4f46e5'};
  color: ${props => props.disabled ? '#94a3b8' : 'white'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    background-color: #4338ca;
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`

export const ResultsContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  h2 {
    color: #2d3748;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }
`

export const ResultItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.5rem;
  background-color: #f8fafc;
  margin: 1rem 0;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  h3 {
    color: #4338ca;
    margin-bottom: 0.5rem;
  }

  p {
    color: #4b5563;
    line-height: 1.5;
  }
` 