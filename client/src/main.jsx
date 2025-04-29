import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import '@mantine/core/styles.css' // Mantine core styles
import '@mantine/notifications/styles.css' // Mantine notifications styles
import '@mantine/carousel/styles.css' // Mantine carousel styles
import '@mantine/charts/styles.css' // Mantine charts styles
import './locales/i18n.js' // i18n initialization

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
