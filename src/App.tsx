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

const prizes = ['0.01 ETH', '0.05 ETH', '0.1 ETH', 'Try Again', '0.5 ETH']

function App() {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null)
  const [walletConnected, setWalletConnected] = useState(false)
  const [balance, setBalance] = useState(1.0)
  const [message, setMessage] = useState('')
  const [isScratching, setIsScratching] = useState(false)

  useEffect(() => {
    fetch('http://198.244.231.52:30322/info')
      .then((res) => res.json())
      .then((data) => setServerInfo(data))
  }, [])

  const connectWallet = () => {
    setWalletConnected(true)
    setMessage('Wallet connected!')
  }

  const buyScratchCard = () => {
    if (balance < 0.1) {
      setMessage('Insufficient balance!')
      return
    }

    setIsScratching(true)
    setBalance((prev) => parseFloat((prev - 0.1).toFixed(2)))

    setTimeout(() => {
      const result = prizes[Math.floor(Math.random() * prizes.length)]
      setMessage(`You won: ${result}`)
      setIsScratching(false)
    }, 1000)
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
            <button onClick={buyScratchCard} disabled={isScratching}>
              {isScratching ? 'Scratching...' : 'Buy Scratch Card (0.1 ETH)'}
            </button>
            <p>{message}</p>
          </>
        )}
      </div>
    </>
  )
}

export default App