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
  const [walletConnected, setWalletConnected] = useState(false)
  const [balance, setBalance] = useState(1.0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://198.244.231.52:30322/info')
      .then((res) => res.json())
      .then((data) => setServerInfo(data))
  }, [])

  useEffect(() => {
    const scratchCardContainer = document.createElement('div')
    scratchCardContainer.className = 'scratch-card-container'
    document.querySelector('#root')?.appendChild(scratchCardContainer)

    const scratchCard = new ScratchCard(scratchCardContainer, {
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
    setMessage('Wallet connected!')
  }

  return (
    <>
      <title>New Crypto Scratch</title>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Fivem Server Info</h1>
      <div className="card">
        {serverInfo ? (
          <ul>
            <li>Name: {serverInfo.name}</li>
            <li>Description: {serverInfo.description}</li>
            <li>Players: {serverInfo.players}</li>
            <li>Max Players: {serverInfo.maxPlayers}</li>
            <li>Gamemode: {serverInfo.gamemode}</li>
            <li>Map: {serverInfo.map}</li>
          </ul>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="card">
        <h1>Crypto Scratch Card</h1>
        {!walletConnected ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <>
            <p>Balance: {balance.toFixed(2)} ETH</p>
            <p>{message}</p>
          </>
        )}
      </div>
    </>
  )
}

export default App