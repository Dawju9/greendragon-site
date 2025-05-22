import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize scratch cards
import { ScratchCard } from './scratchcads'

const initScratchCards = () => {
  const root = document.getElementById('root')
  if (root) {
    const scratchCard = new ScratchCard('#root', {
      scratchType: 'circle',
      containerWidth: window.innerWidth,
      containerHeight: window.innerHeight,
      imageForwardSrc: '/scratch-overlay.png',
      imageBackgroundSrc: '/background.png',
      htmlBackground: '<div class="scratch-bg"></div>',
      brushSrc: '/brush.png',
      radius: 20,
      nPoints: 30,
      percent: 50,
      onComplete: () => {
        console.log('Scratch completed!')
      }
    })

    scratchCard.init().then(() => {
      scratchCard.canvas.addEventListener('scratch', (event: MouseEvent) => {
        // Handle scratch events
        const scratch = document.createElement('div')
        scratch.className = 'scratch-effect'
        const x = event.clientX
        const y = event.clientY
        scratch.style.left = `${x}px`
        scratch.style.top = `${y}px`
        document.body.appendChild(scratch)
        setTimeout(() => scratch.remove(), 1000)
      })
    })
  }
}
initScratchCards()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)