import styled from 'styled-components'

export const CardContainer = styled.div`
  width: 100%;
  max-width: 700px;
  margin-top: 1.5rem;
`

export const Card = styled.div`
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 2rem 1rem;
  padding-bottom: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

export const PromptName = styled.h2`
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 1rem;
  text-align: center;
`

export const InstructionText = styled.p`
  color: #4b5563;
  font-size: 0.95rem;
  font-weight: 800;
  text-align: center;
  margin: 0 auto 2em auto;
  max-width: 400px;
`

export const LabelsList = styled.div`  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  justify-content: center;
`

export const Label = styled.span`
  background: #f7fafc;
  color: #4a5568;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
`

export const ButtonsContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1.5rem;
`

export const ActionButton = styled.button<{ 
  $variant: 'good' | 'bad' | 'ok';
  $selected?: boolean;
}>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.15s ease;
  outline: none;

  ${props => {
    switch (props.$variant) {
      case 'good':
        return `
          background-color: ${props.$selected ? '#22c55e' : '#dcfce7'};
          color: ${props.$selected ? 'white' : '#166534'};
          &:hover { background-color: #22c55e; color: white; }
        `
      case 'bad':
        return `
          background-color: ${props.$selected ? '#ef4444' : '#fee2e2'};
          color: ${props.$selected ? 'white' : '#991b1b'};
          &:hover { background-color: #ef4444; color: white; }
        `
      case 'ok':
        return `
          background-color: ${props.$selected ? '#eab308' : '#fef3c7'};
          color: ${props.$selected ? 'white' : '#92400e'};
          &:hover { background-color: #eab308; color: white; }
        `
    }
  }}

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: none;
  }

  &::-moz-focus-inner {
    border: 0;
  }

  transform: ${props => props.$selected ? 'scale(1.05)' : 'scale(1)'};

  &:active {
    transform: scale(0.98);
  }
`

export const SubmitButton = styled.button<{ 
  disabled?: boolean;
  $isFinal?: boolean;
}>`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.disabled ? '#cbd5e1' : '#4f46e5'};
  color: white;
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.disabled ? 0.7 : 1};
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover:not(:disabled) {
    background-color: #4338ca;
    transform: translateY(-2px);
  }

  &::before {
    content: '→';
    font-size: 1.5rem;
  }
`

export const LoadingDots = styled.span`
  &::after {
    content: '';
    animation: dots 1.5s steps(5, end) infinite;
  }

  @keyframes dots {
    0%, 20% { content: ''; }
    40% { content: '.'; }
    60% { content: '..'; }
    80%, 100% { content: '...'; }
  }
`

export const LoadingText = styled.div`
  text-align: center;
  padding: 2rem;
  color: white;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-weight: 900;
` 
