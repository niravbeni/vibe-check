import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #f2902e;  /* Previous orange */
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
  }

  * {
    box-sizing: border-box;
  }

  #root {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    width: 100%;
  }
` 