import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import { initMocks } from './lib/mocks'

async function main() {
  if (process.env.NODE_ENV === 'development') {
    await initMocks()
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

main()
