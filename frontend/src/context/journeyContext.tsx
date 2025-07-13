import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '@/utils/axios';
import { useAuth } from '@/context/authContext';
import { getCSRFToken } from '@/utils/auth/tokens';
import type { Journey } from '@/utils/types';
import type { JourneyContextType } from '@/utils/types';
axios.defaults.withCredentials = true

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);


export const JourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [journey, setJourney] = useState<Journey | null>(null);
  const [journeyLoading, setJourneyLoading] = useState(true);

  
  const fetchJourney = async () => {
    setJourneyLoading(true);
    try {
      const response = await axios.get<Journey>('/api/user/journey/');
      setJourney(response.data);
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

  const createJourney = async (title: string, arc_progress: Journey["arc_progress"]) => {
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

      const res = await axios.post<Journey>(
        '/api/user/journey/',
        { title, arc_progress },
        {
          headers: {
            'X-CSRFToken': csrfToken || '',
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      setJourney(res.data);
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
