export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  environment: import.meta.env.MODE,
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
};