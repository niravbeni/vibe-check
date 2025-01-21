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

export const LabelsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  justify-content: center;
`

export const Label = styled.span<{ category: string }>`
  background-color: ${props => {
    switch (props.category) {
      case 'mood':
        return '#E8F5E9'; // light green
      case 'style':
        return '#E3F2FD'; // light blue
      case 'colors':
        return '#FFF3E0'; // light orange
      case 'materials':
        return '#F3E5F5'; // light purple
      case 'aesthetic':
        return '#FFEBEE'; // light red
      default:
        return '#f0f0f0';
    }
  }};
  color: ${props => {
    switch (props.category) {
      case 'mood':
        return '#2E7D32'; // dark green
      case 'style':
        return '#1565C0'; // dark blue
      case 'colors':
        return '#E65100'; // dark orange
      case 'materials':
        return '#6A1B9A'; // dark purple
      case 'aesthetic':
        return '#C62828'; // dark red
      default:
        return '#333';
    }
  }};
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  margin: 0.25rem;
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

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`

export const LabelSection = styled.div`
  margin-bottom: 1.5rem;
`

export const CategoryTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #666;
  text-transform: capitalize;
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`

export const EvalButton = styled.button<{ color: 'green' | 'yellow' | 'red' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => {
    switch(props.color) {
      case 'green':
        return `
          background-color: ${props['aria-selected'] ? '#4CAF50' : '#E8F5E9'};
          color: ${props['aria-selected'] ? 'white' : '#2E7D32'};
          &:hover:not(:disabled) { background-color: #4CAF50; color: white; }
        `
      case 'yellow':
        return `
          background-color: ${props['aria-selected'] ? '#FFC107' : '#FFF8E1'};
          color: ${props['aria-selected'] ? 'black' : '#F57F17'};
          &:hover:not(:disabled) { background-color: #FFC107; color: black; }
        `
      case 'red':
        return `
          background-color: ${props['aria-selected'] ? '#F44336' : '#FFEBEE'};
          color: ${props['aria-selected'] ? 'white' : '#C62828'};
          &:hover:not(:disabled) { background-color: #F44336; color: white; }
        `
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  transform: ${props => props['aria-selected'] ? 'scale(1.05)' : 'scale(1)'};

  &:active {
    transform: scale(0.98);
  }
`

export const CategoryKey = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`

export const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #666;
`

export const ColorDot = styled.div<{ category: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.category) {
      case 'mood':
        return '#2E7D32';
      case 'style':
        return '#1565C0';
      case 'colors':
        return '#E65100';
      case 'materials':
        return '#6A1B9A';
      case 'aesthetic':
        return '#C62828';
      default:
        return '#333';
    }
  }};
` 
