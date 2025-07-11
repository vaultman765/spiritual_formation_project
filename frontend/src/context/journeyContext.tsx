// src/context/journeyContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './authContext';
import axios from 'axios';

export interface ArcProgress {
  arcId: string;
  arcTitle: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  currentDay?: number;
  dayCount: number;
}

export interface Journey {
  title: string;
  arcProgress: ArcProgress[];
}

interface JourneyContextType {
  journey: Journey | null;
  refreshJourney: () => Promise<void>;
  createJourney: (title?: string) => Promise<void>;
}

function getCSRFToken(): string | null {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + '=')) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const JourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [journey, setJourney] = useState<Journey | null>(null);

  const fetchJourney = async () => {
    if (!user) return;

    try {
      const response = await axios.get('/api/user/journey/');
      setJourney(response.data as Journey);
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn('No journey found — creating new one...');
        await createJourney();
      } else {
        console.error('Error loading journey:', error);
      }
    }
  };

  // TODO: Replace with journey selector
  const createJourney = async () => {
    try {
      const defaultPayload = {
        title: 'My Journey with Ignatian Mental Prayer',
        arc_progress: [],
      };

      const csrfToken = getCSRFToken();

      const response = await axios.post(
        '/api/user/journey/',
        defaultPayload,
        {
          headers: {
            'X-CSRFToken': csrfToken || '',
            'Content-Type': 'application/json',
          },
          withCredentials: true, // ← this is crucial if frontend/backend are on different ports
        }
      );

      setJourney(response.data as Journey);
    } catch (error) {
      console.error('Failed to create default journey:', error);
    }
  };

  useEffect(() => {
    fetchJourney();
  }, [user]);

  return (
    <JourneyContext.Provider value={{ journey, refreshJourney: fetchJourney, createJourney }}>
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = () => {
  const context = useContext(JourneyContext);
  if (!context) throw new Error('useJourney must be used within JourneyProvider');
  return context;
};
