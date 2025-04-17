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

  useEffect(() => {
    fetch('http://198.244.231.52:30322/info')
      .then((res) => res.json())
      .then((data) => setServerInfo(data))
  }, [])

  return (
    <>
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
    </>
  )
}

export default App

