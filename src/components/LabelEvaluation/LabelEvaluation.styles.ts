import styled from 'styled-components'

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

export const PromptInfo = styled.div`
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
`

export const LabelsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
`

export const Label = styled.div`
  background-color: #e0e7ff;
  color: #4338ca;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.875rem;
`

export const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
`

interface EvalButtonProps {
  $variant: 'not-effective' | 'somewhat-effective' | 'very-effective';
}

export const EvalButton = styled.button<EvalButtonProps>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;

  ${props => {
    switch (props.$variant) {
      case 'not-effective':
        return `
          background-color: #fee2e2;
          color: #991b1b;
        `
      case 'somewhat-effective':
        return `
          background-color: #fef3c7;
          color: #92400e;
        `
      case 'very-effective':
        return `
          background-color: #dcfce7;
          color: #166534;
        `
    }
  }}
`

export const Progress = styled.div`
  text-align: center;
  color: #666;
` 