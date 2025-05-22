import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css'
import { ScratchCard } from './components/scratchcard';

export default function App() {
  return (
    <ScratchCard width={300} height={300} image={"../src/zdrapa.jpg"} finishPercent={70} onComplete={() => {}} children={<div>Scratch me!</div>} />
  );
}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);