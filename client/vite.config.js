import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    server:{
      proxy:{
        '/api':{
          target:"http://localhost:3000",
          secure:true,
        },
      },
    },
    plugins: [react()],
    define: {
      // Make env variables available globally
      'process.env': env
    }
  }
})
