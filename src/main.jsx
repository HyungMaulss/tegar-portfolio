import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Finish the splash from index.html once fonts are in and it has been seen briefly, then remove it.
const splash = document.getElementById('splash')
if (splash) {
  const seen = new Promise((r) => setTimeout(r, 900))
  Promise.all([document.fonts?.ready, seen]).then(() => {
    splash.classList.add('is-done')
    setTimeout(() => splash.remove(), 1000)
  })
}
