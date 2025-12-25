import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './styles/light.css'
import './styles/dark.css'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
