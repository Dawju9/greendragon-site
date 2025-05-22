import { useState, useEffect } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import { ScratchCard } from './main'

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
  const [balance] = useState(() => {
    const saved = localStorage.getItem('balance')
    return saved ? parseFloat(saved) : 1.0
  })

  useEffect(() => {
    fetch('http://198.244.231.52:30322/info')
      .then((res) => res.json())
      .then((data) => setServerInfo(data))
      .catch(error => console.error('Failed to fetch server info:', error))
  }, [])

  useEffect(() => {
    localStorage.setItem('walletConnected', JSON.stringify(walletConnected))
    localStorage.setItem('balance', balance.toString())
  }, [walletConnected, balance])

  useEffect(() => {
    fetch('http://198.244.231.52:30322/user')
    if (walletConnected) {
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

    return () => {
      document.querySelector('.scratch-card-container')?.remove()
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