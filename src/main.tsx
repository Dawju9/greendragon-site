import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'

// Initialize session storage
const saveToSession = (key: string, value: any) => {
  sessionStorage.setItem(key, JSON.stringify(value))
}

const getFromSession = (key: string) => {
  const item = sessionStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

// Create scratch effect interaction
const initScratchEffect = () => {
  const root = document.getElementById('root')
  if (root) {
    root.addEventListener('mousemove', (e) => {
      const x = e.clientX
      const y = e.clientY
      const scratch = document.createElement('div')
      scratch.className = 'scratch-effect'
      scratch.style.left = `${x}px`
      scratch.style.top = `${y}px`
      document.body.appendChild(scratch)
      setTimeout(() => scratch.remove(), 1000)
    })
  }
}

initScratchEffect()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)