import { useState, useEffect } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

interface ServerInfo {
  name: string
  description: string
  players: number
  maxPlayers: number
  gamemode: string
  map: string
}

export default function App() {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null)
  const [walletConnected, setWalletConnected] = useState(() => {
    const saved = localStorage.getItem('walletConnected')
    return saved ? JSON.parse(saved) : false
  })
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('balance')
    return saved ? parseFloat(saved) : 1.0
  })

  useEffect(() => {
    fetch('http://:30322/info')
      .then((res) => res.json())
      .then((data) => setServerInfo(data))
  }, [])

  useEffect(() => {
    localStorage.setItem('walletConnected', JSON.stringify(walletConnected))
    localStorage.setItem('balance', balance.toString())
  }, [walletConnected, balance])

  useEffect(() => {
    const scratchCardContainer = document.createElement('div')
    scratchCardContainer.className = 'scratch-card-container'
    document.querySelector('#root')?.appendChild(scratchCardContainer)

    interface ScratchCardOptions {
      rewards: number[]
      requiredScratched: number
    }

    class ScratchCardClass {
      private canvas: HTMLCanvasElement
      private ctx: CanvasRenderingContext2D
      private isDrawing: boolean = false
      private lastX: number = 0
      private lastY: number = 0
      private scratchedPixels: number = 0
      private totalPixels: number
      private rewards: number[]
      private requiredScratched: number
      private brushPattern: ImageData | null = null

      constructor(container: HTMLElement, options: ScratchCardOptions) {
        this.canvas = document.createElement('canvas')
        this.canvas.width = 300
        this.canvas.height = 200
        this.ctx = this.canvas.getContext('2d')!
        this.totalPixels = this.canvas.width * this.canvas.height
        this.rewards = options.rewards
        this.requiredScratched = options.requiredScratched

        this.createBrushPattern()
        this.initCanvas()
        this.setupEventListeners()
        container.appendChild(this.canvas)
      }

      private createBrushPattern() {
        const patternCanvas = document.createElement('canvas')
        patternCanvas.width = 20
        patternCanvas.height = 20
        const patternCtx = patternCanvas.getContext('2d')!
        
        patternCtx.fillStyle = '#000000'
        patternCtx.beginPath()
        patternCtx.arc(10, 10, 8, 0, Math.PI * 2)
        patternCtx.fill()
        
        this.brushPattern = patternCtx.getImageData(0, 0, 20, 20)
      }

      private initCanvas() {
        // Create gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height)
        gradient.addColorStop(0, '#666666')
        gradient.addColorStop(0.5, '#888888')
        gradient.addColorStop(1, '#666666')
        
        this.ctx.fillStyle = gradient
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        
        // Add some texture
        for (let i = 0; i < 1000; i++) {
          const x = Math.random() * this.canvas.width
          const y = Math.random() * this.canvas.height
          this.ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.1})`
          this.ctx.beginPath()
          this.ctx.arc(x, y, 1, 0, Math.PI * 2)
          this.ctx.fill()
        }
        
        this.drawRewards()
      }

      private drawRewards() {
        const reward = this.rewards[Math.floor(Math.random() * this.rewards.length)]
        this.ctx.save()
        this.ctx.globalCompositeOperation = 'destination-over'
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0)
        gradient.addColorStop(0, '#ffd700')
        gradient.addColorStop(1, '#ff8c00')
        this.ctx.fillStyle = gradient
        this.ctx.font = 'bold 28px Arial'
        this.ctx.textAlign = 'center'
        this.ctx.fillText(`Win ${reward} CRYPTO!`, this.canvas.width / 2, this.canvas.height / 2)
        this.ctx.restore()
      }

      private setupEventListeners() {
        let isTouch = false

        const startDrawing = (e: MouseEvent | Touch) => {
          this.isDrawing = true
          const rect = this.canvas.getBoundingClientRect()
          this.lastX = (isTouch ? e.clientX : (e as MouseEvent).clientX) - rect.left
          this.lastY = (isTouch ? e.clientY : (e as MouseEvent).clientY) - rect.top
        }

        const draw = (e: MouseEvent | Touch) => {
          if (!this.isDrawing) return
          const rect = this.canvas.getBoundingClientRect()
          const currentX = (isTouch ? e.clientX : (e as MouseEvent).clientX) - rect.left
          const currentY = (isTouch ? e.clientY : (e as MouseEvent).clientY) - rect.top

          this.ctx.globalCompositeOperation = 'destination-out'
          this.ctx.lineWidth = 20
          this.ctx.lineCap = 'round'
          this.ctx.lineJoin = 'round'

          // Draw line
          this.ctx.beginPath()
          this.ctx.moveTo(this.lastX, this.lastY)
          this.ctx.lineTo(currentX, currentY)
          this.ctx.stroke()

          // Apply brush pattern
          if (this.brushPattern) {
            const dx = currentX - this.lastX
            const dy = currentY - this.lastY
            const distance = Math.sqrt(dx * dx + dy * dy)
            const steps = Math.ceil(distance / 5)
            
            for (let i = 0; i < steps; i++) {
              const x = this.lastX + (dx * i / steps)
              const y = this.lastY + (dy * i / steps)
              this.ctx.putImageData(this.brushPattern, x - 10, y - 10)
            }
          }

          this.lastX = currentX
          this.lastY = currentY
          this.calculateScratchedArea()
        }

        this.canvas.addEventListener('mousedown', (e) => {
          isTouch = false
          startDrawing(e)
        })

        this.canvas.addEventListener('mousemove', (e) => {
          if (this.isDrawing) draw(e)
        })

        this.canvas.addEventListener('mouseup', () => {
          this.isDrawing = false
          this.checkProgress()
        })

        this.canvas.addEventListener('touchstart', (e) => {
          isTouch = true
          e.preventDefault()
          startDrawing(e.touches[0])
        })

        this.canvas.addEventListener('touchmove', (e) => {
          e.preventDefault()
          if (this.isDrawing) draw(e.touches[0])
        })

        this.canvas.addEventListener('touchend', () => {
          this.isDrawing = false
          this.checkProgress()
        })
      }

      private calculateScratchedArea() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        this.scratchedPixels = imageData.data.filter((_, i) => i % 4 === 3 && imageData.data[i] === 0).length
      }

      private checkProgress() {
        const scratchedPercentage = (this.scratchedPixels / this.totalPixels) * 100
        if (scratchedPercentage >= this.requiredScratched) {
          const reward = this.rewards[Math.floor(Math.random() * this.rewards.length)]
          const event = new CustomEvent('scratchcard:complete', {
            detail: { totalWinnings: reward }
          })
          this.canvas.dispatchEvent(event)
        }
      }

      reset() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.scratchedPixels = 0
        this.initCanvas()
      }
    }

    const scratchCard = new ScratchCardClass(scratchCardContainer, {
      rewards: [0, 0, 0, 5, 10, 20, 50, 100, 500],
      requiredScratched: 6
    })

    scratchCardContainer.addEventListener('scratchcard:complete', (event: Event) => {
      const customEvent = event as CustomEvent
      setBalance(prev => prev + customEvent.detail.totalWinnings)
      setTimeout(() => {
        scratchCard.reset()
      }, 2000)
    })

    return () => {
      scratchCardContainer.remove()
    }
  }, [walletConnected])

  const connectWallet = () => {
    setWalletConnected(true)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <title>New Crypto Scratch</title>
        <div className="logo-container">
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
        </div>
      </header>
      <main className="main-content">
        <section className="server-info-section">
          <h1 className="section-title">Fivem Server Info</h1>
          <div className="card server-info-card">
            {serverInfo ? (
              <ul className="server-info-list">
                <li className="info-item">Name: <span>{serverInfo.name}</span></li>
                <li className="info-item">Description: <span>{serverInfo.description}</span></li>
                <li className="info-item">Players: <span>{serverInfo.players}</span></li>
                <li className="info-item">Max Players: <span>{serverInfo.maxPlayers}</span></li>
                <li className="info-item">Gamemode: <span>{serverInfo.gamemode}</span></li>
                <li className="info-item">Map: <span>{serverInfo.map}</span></li>
              </ul>
            ) : (
              <p className="loading">Loading...</p>
            )}
          </div>
        </section>
        <section className="crypto-section">
          <div className="card crypto-card">
            <h1 className="section-title">Crypto Scratch Card</h1>
            {!walletConnected ? (
              <button className="connect-wallet" onClick={connectWallet}>Connect Wallet</button>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  )
}