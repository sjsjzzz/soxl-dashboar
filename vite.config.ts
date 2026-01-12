import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Vital: Inject the API KEY from Vercel environment to the client code
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Prevent "process is not defined" crash in browser
      'process.env': JSON.stringify({ API_KEY: env.API_KEY })
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'recharts', 'lucide-react', '@google/genai']
          }
        }
      }
    }
  };
});