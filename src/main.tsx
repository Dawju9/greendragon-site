import React from 'react'
import ReactDOM from 'react-dom/client'
import './App.css'
import { ScratchCard } from './components/scratchcard'

export default function App() {
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ScratchCard width={300} height={300} image={"placeholder.jpg"} finishPercent={70} onComplete={() => {}} children={<div>Scratch me!</div>} />
  </React.StrictMode>
)