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
  padding: 1rem;
  padding-bottom: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

export const PromptName = styled.h2`
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 1rem;
  text-align: center;
`

export const LabelsList = styled.div`
  display: flex;
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
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  opacity: ${props => props.$selected ? 1 : 0.7};
  transform: ${props => props.$selected ? 'scale(1.05)' : 'scale(1)'};

  ${props => {
    switch (props.$variant) {
      case 'good':
        return `
          background-color: ${props.$selected ? '#86efac' : '#dcfce7'};
          color: #166534;
          &:hover { background-color: #bbf7d0; }
        `
      case 'bad':
        return `
          background-color: #fee2e2;
          color: #991b1b;
          &:hover { background-color: #fecaca; }
        `
      case 'ok':
        return `
          background-color: #fef3c7;
          color: #92400e;
          &:hover { background-color: #fde68a; }
        `
    }
  }}

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
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