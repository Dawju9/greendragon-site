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

function App() {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null)
  const [walletConnected, setWalletConnected] = useState(() => {
    const saved = localStorage.getItem('walletConnected')
    return saved ? JSON.parse(saved) : false
  })
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('balance')
    return saved ? parseFloat(saved) : 1.0
  })
  const [message, setMessage] = useState('')
  const [isScratching, setIsScratching] = useState(false)

  useEffect(() => {
    fetch('http://198.244.231.52:30322/info')
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
      private scratchedPixels: number = 0
      private totalPixels: number
      private rewards: number[]
      private requiredScratched: number

      constructor(container: HTMLElement, options: ScratchCardOptions) {
        this.canvas = document.createElement('canvas')
        this.canvas.width = 300
        this.canvas.height = 200
        this.ctx = this.canvas.getContext('2d')!
        this.totalPixels = this.canvas.width * this.canvas.height
        this.rewards = options.rewards
        this.requiredScratched = options.requiredScratched

        this.initCanvas()
        this.setupEventListeners()
        container.appendChild(this.canvas)
      }

      private initCanvas() {
        this.ctx.fillStyle = '#888888'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawRewards()
      }

      private drawRewards() {
        const reward = this.rewards[Math.floor(Math.random() * this.rewards.length)]
        this.ctx.save()
        this.ctx.globalCompositeOperation = 'destination-over'
        this.ctx.fillStyle = '#ffffff'
        this.ctx.font = '24px Arial'
        this.ctx.textAlign = 'center'
        this.ctx.fillText(`Win ${reward} CRYPTO!`, this.canvas.width / 2, this.canvas.height / 2)
        this.ctx.restore()
      }

      private setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => {
          this.isDrawing = true
          this.scratch(e)
        })

        this.canvas.addEventListener('mousemove', (e) => {
          if (this.isDrawing) this.scratch(e)
        })

        this.canvas.addEventListener('mouseup', () => {
          this.isDrawing = false
          this.checkProgress()
        })

        this.canvas.addEventListener('touchstart', (e) => {
          this.isDrawing = true
          this.scratch(e.touches[0])
        })

        this.canvas.addEventListener('touchmove', (e) => {
          if (this.isDrawing) this.scratch(e.touches[0])
        })

        this.canvas.addEventListener('touchend', () => {
          this.isDrawing = false
          this.checkProgress()
        })
      }

      private scratch(e: MouseEvent | Touch) {
        const rect = this.canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        this.ctx.globalCompositeOperation = 'destination-out'
        this.ctx.beginPath()
        this.ctx.arc(x, y, 10, 0, Math.PI * 2)
        this.ctx.fill()

        this.calculateScratchedArea()
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
      setIsScratching(false)
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
    setMessage('Wallet connected!')
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