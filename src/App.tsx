import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css'
import { Scratchcard } from './components/scratchcard';

export default function App() {
  return (
    <Scratchcard width={undefined} height={undefined} image={undefined} finishPercent={undefined} onComplete={undefined} children={undefined} />
  );
}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);