import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueryBuilderProvider } from './context/QueryBuilderContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryBuilderProvider>

      <App />
    </QueryBuilderProvider>
  </StrictMode>,
)
