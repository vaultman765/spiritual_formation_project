import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from '@/context/authContext';
import { JourneyProvider } from '@/context/journeyContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <JourneyProvider>
        <App />
      </JourneyProvider>
    </AuthProvider>
  </React.StrictMode>
)
