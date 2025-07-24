import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from '@/context/authContext';
import { JourneyProvider } from '@/context/journeyContext';
import { ModalProvider } from '@/context/modalContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <JourneyProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </JourneyProvider>
    </AuthProvider>
  </React.StrictMode>
);