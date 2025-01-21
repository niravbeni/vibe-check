import styled from 'styled-components'

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  margin: 0 auto;
  overflow: hidden;

  h1 {
    color: white;
    font-size: 2rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`

export const TitleCheckmark = styled.button`
  background: none;
  border: none;
  font-size: 1.75rem;
  padding: 0;
  margin: 0;
  margin-top: -0.25rem;
  cursor: pointer;
  display: inline-flex;
  line-height: 1;
  vertical-align: middle;
  appearance: none;
  outline: none;

  /* Remove focus outline but keep it for keyboard navigation */
  &:focus {
    outline: none;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }

  &:focus-visible {
    outline: none;
  }

  /* Remove any default button spacing */
  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  &:hover {
    opacity: 0.8;
  }
`

export const GenerateButton = styled.button<{ disabled?: boolean }>`
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  background-color: ${props => props.disabled ? '#cbd5e1' : '#10b981'};
  color: ${props => props.disabled ? 'grey' : 'white'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  margin-top: 2.5rem;

  &:hover:not(:disabled) {
    background-color: "#059669";
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
  color: white;
  font-size: 1.2rem;
  font-weight: 800;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

export const SuccessCheckmark = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;  // Center horizontally with auto margins
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &::before {
    content: '✓';
    color: white;
    font-size: 2.5rem;
  }
`

export const LoadingBar = styled.div`
  width: 200px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin: 2.5rem auto;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 30%;
    background-color: white;
    border-radius: 2px;
    animation: loading 1.5s infinite ease-in-out;
  }

  @keyframes loading {
    0% {
      left: -30%;
    }
    100% {
      left: 100%;
    }
  }
` 