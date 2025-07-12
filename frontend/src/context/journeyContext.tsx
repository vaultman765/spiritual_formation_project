import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '@/utils/axios';
import { useAuth } from './authContext';
import type { ArcProgress, Journey } from '@/utils/types';
import type { RawJourneyResponse, JourneyContextType } from '@/utils/types';

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

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

function normalizeJourney(data: RawJourneyResponse): Journey {
  return {
    id: data.id,
    title: data.title,
    arcProgress: data.arc_progress.map((arc) => ({
      arcId: arc.arcId,
      arcTitle: arc.arcTitle,
      dayCount: arc.dayCount,
      status: arc.status,
      currentDay: arc.currentDay,
    })),
  };
}

export const JourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [journey, setJourney] = useState<Journey | null>(null);
  const [journeyLoading, setJourneyLoading] = useState(true);

  
  const fetchJourney = async () => {
    setJourneyLoading(true);
    try {
      const response = await axios.get<RawJourneyResponse>('/api/user/journey/');
      setJourney(normalizeJourney(response.data));
    } catch (error: any) {
      if (error.response?.status === 404) {
        setJourney(null); // Explicitly set to null if no journey exists
      } else {
        console.error('Error fetching journey:', error);
      }
    } finally {
      setJourneyLoading(false);
    }
  };

  const createJourney = async (title: string, arcProgress: ArcProgress[]) => {
    const csrfToken = getCSRFToken();
    try {
      if (journey) {
        await axios.delete('/api/user/journey/', {
          headers: {
            'X-CSRFToken': csrfToken || '',
            'Content-Type': 'application/json',
        },
        withCredentials: true
        });
      }

      const res = await axios.post<RawJourneyResponse>(
        '/api/user/journey/',
        { title, arc_progress: arcProgress },
        {
          headers: {
            'X-CSRFToken': csrfToken || '',
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      const normalized = normalizeJourney(res.data);
      setJourney(normalized);
    } catch (err) {
      console.error('Failed to create or overwrite journey:', err);
    }
  };

  useEffect(() => {
    fetchJourney();
  }, [user]);

  return (
    <JourneyContext.Provider value={{ journey, journeyLoading, refreshJourney: fetchJourney, createJourney }}>
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = () => {
  const context = useContext(JourneyContext);
  if (!context) throw new Error('useJourney must be used within JourneyProvider');
  return context;
};
