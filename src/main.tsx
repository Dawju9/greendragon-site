import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

export interface ScratchCardOptions {
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

export class ScratchCard {
  canvas: HTMLCanvasElement
  options: ScratchCardOptions // Add the options property here
  
  constructor(selector: string, options: ScratchCardOptions) {
    this.canvas = document.createElement('canvas')
    this.canvas.id = selector.substring(1)
    document.body.appendChild(this.canvas)
    this.options = options
  }

  init() {
    return Promise.resolve()
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)