// API URL based on environment
export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-render-api-url.onrender.com'  // You'll need to replace this with your actual Render URL
  : 'http://localhost:3000'; 