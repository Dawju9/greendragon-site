import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

interface ScratchCardOptions {
  scratchType: string
  containerWidth: number
  containerHeight: number
  imageForwardSrc: string
  imageBackgroundSrc: string
  htmlBackground: string
  brushSrc: string
  radius: number
  nPoints: number
  percent: number
  onComplete: () => void
}

class ScratchCard {
  canvas: HTMLCanvasElement
  
  constructor(selector: string, options: ScratchCardOptions) {
    this.canvas = document.createElement('canvas')
  }

  init() {
    return Promise.resolve()
  }
}

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
      scratchCard.canvas.addEventListener('mousemove', (event: MouseEvent) => {
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
}initScratchCards()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)