import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "@/utils/axios";
import { useAuth } from "@/context/authContext";
import { getCSRFToken } from "@/utils/auth/tokens";
import type { Journey, JourneyContextType } from "@/utils/types";
const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const JourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);
  const [pastJourneys, setPastJourneys] = useState<Journey[]>([]);
  const [journeyLoading, setJourneyLoading] = useState(true);
  const [archivedJourneys, setArchivedJourneys] = useState<Journey[]>([]);
  const csrfToken = getCSRFToken();

  const headers = {
    "X-CSRFToken": csrfToken || "",
    "Content-Type": "application/json",
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const restartJourney = async () => {
    try {
      await axios.post(
        `${API_URL}/api/user/journey/restart/`,
        {},
        {
          headers: headers,
          withCredentials: true,
        }
      );

      await fetchJourneys(); // Refresh updated state
    } catch (err) {
      console.error("Failed to restart journey:", err);
    }
  };

  const fetchPastJourneys = async () => {
    try {
      const res = await axios.get<Journey[]>(`${API_URL}/api/user/journeys/`);
      const allJourneys = res.data;

      // Split active vs inactive
      const past = allJourneys.filter((j) => !j.is_active);
      setArchivedJourneys(past);
    } catch (err) {
      console.error("Failed to fetch past journeys:", err);
    }
  };

  const restoreJourney = async (id: number) => {
    try {
      const res = await axios.post<Journey>(
        `${API_URL}/api/user/journey/${id}/restore/`,
        {},
        {
          headers: headers,
          withCredentials: true,
        }
      );
      setActiveJourney(res.data);
      await fetchJourneys(); // sync all journeys
    } catch (err) {
      console.error("Failed to restore journey:", err);
    }
  };

  const fetchJourneys = async (): Promise<void> => {
    setJourneyLoading(true);
    try {
      const res = await axios.get<Journey[]>(`${API_URL}/api/user/journeys/`);
      const allJourneys = res.data;
      setJourneys(allJourneys);

      const active = allJourneys.find((j) => j.is_active);
      const past = allJourneys.filter((j) => !j.is_active);
      setActiveJourney(null); // Force re-render by resetting first
      setActiveJourney(active || null); // Then set the actual active journey
      setPastJourneys(past);
    } catch (err) {
      console.error("Failed to fetch user journeys:", err);
    } finally {
      setJourneyLoading(false);
    }
  };

  const createJourney = async (data: { title: string; arc_progress: Journey["arc_progress"] }) => {
    try {
      if (activeJourney) {
        await axios.post(
          `${API_URL}/api/user/journey/archive/`,
          {},
          {
            headers: headers,
            withCredentials: true,
          }
        );
      }

      const res = await axios.post<Journey>(`${API_URL}/api/user/journey/`, data, {
        headers: headers,
        withCredentials: true,
      });
      setActiveJourney(res.data);
      await fetchJourneys(); // refresh all
    } catch (err) {
      console.error("Failed to create or overwrite journey:", err);
    }
  };

  const skipDay = async (): Promise<void> => {
    try {
      await axios.post<Journey>(
        `${API_URL}/api/user/journey/skip-day/`,
        {},
        {
          headers: headers,
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error("Failed to skip day:", err);
    }
  };

  const skipArc = async (): Promise<void> => {
    try {
      await axios.post<Journey>(
        `${API_URL}/api/user/journey/skip-arc/`,
        {},
        {
          headers: headers,
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error("Failed to skip arc:", err);
    }
  };

  const completeJourney = async (): Promise<void> => {
    try {
      await axios.post<Journey>(
        `${API_URL}/api/user/journey/complete/`,
        {},
        {
          headers: headers,
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error("Failed to complete journey:", err);
    }
  };

  const updateJourney = async (journeyId: number, title: string, arcData: any[]) => {
    const response = await fetch(`${API_URL}/api/user/journey/${journeyId}/`, {
      method: "PATCH",
      headers: headers,
      credentials: "include",
      body: JSON.stringify({
        title,
        arc_progress: arcData,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update journey");
    }

    const updated = await response.json();
    setActiveJourney(updated);
    return updated;
  };

  const markDayComplete = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/api/user/journey/complete-day/ `, {
        method: "POST",
        headers: headers,
        credentials: "include",
      });
      const response = await res.json();
      if (response.arc_complete) {
        localStorage.setItem("justCompletedArc", response.arc_title);
      }
      if (response.journey_complete) {
        localStorage.setItem("justCompletedJourney", response.journey_title);
      }
    } catch (err) {
      console.error("Failed to complete day:", err);
    }
  };

  const deleteJourney = async (journeyId: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/api/user/journey/${journeyId}/`, {
        headers: headers,
        withCredentials: true,
      });
      setJourneys((prev) => prev.filter((j) => j.id !== journeyId));
      if (activeJourney?.id === journeyId) {
        setActiveJourney(null);
      }
    } catch (err) {
      console.error("Failed to delete journey:", err);
    }
  };

  useEffect(() => {
    if (user) fetchJourneys();
    if (user) fetchPastJourneys();
  }, [user]);

  const contextValue = React.useMemo(
    () => ({
      journeys,
      activeJourney,
      pastJourneys,
      journeyLoading,
      archivedJourneys,
      refreshJourneys: fetchJourneys,
      fetchPastJourneys,
      createJourney,
      restoreJourney,
      restartJourney,
      completeJourney,
      skipArc,
      skipDay,
      updateJourney,
      markDayComplete,
      deleteJourney,
    }),
    [
      journeys,
      activeJourney,
      pastJourneys,
      journeyLoading,
      archivedJourneys,
      fetchJourneys,
      fetchPastJourneys,
      createJourney,
      restoreJourney,
      restartJourney,
      completeJourney,
      skipArc,
      skipDay,
      updateJourney,
      markDayComplete,
      deleteJourney,
    ]
  );

  return <JourneyContext.Provider value={contextValue}>{children}</JourneyContext.Provider>;
};

export const useJourney = () => {
  const context = useContext(JourneyContext);
  if (!context) throw new Error("useJourney must be used within JourneyProvider");
  return context;
};
