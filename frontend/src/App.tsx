// App.tsx
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/homepage/HomePage";
import ExplorePage from "@/pages/explore/ExplorePage";
import MeditationDayPage from "@/pages/meditations/MeditationDayPage";
import ArcPage from "@/pages/arcs/ArcPage";
import JourneyPage from "@/pages/journey/JourneyPage";
import LoginPage from "@/pages/login/LoginPage";
import StartJourneyPage from "@/pages/journey/StartJourneyPage";
import RegisterPage from "@/pages/login/RegisterPage";
import NotesPage from "@/pages/notes/NotesPage";
import JourneyEditorPage from "@/pages/journey/JourneyEditorPage";
import HowToPrayPage from "@/pages/how_to_pray/HowToPrayPage";
import { trackPageview } from "@/utils/analytics";
import { useJourney } from "@/context/journeyContext";
import { useAuth } from "@/context/authContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { trackPageviews } from "@/components/seo/ga4";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// This component needs to be inside Router context
function RouteChangeTracker() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    trackPageview(location.pathname + location.search, {
      userId: user?.id ?? null,
    });
  }, [location, user]);

  return null;
}

// This component needs to be inside Router context
function AppRoutes() {
  const { activeJourney } = useJourney();
  const location = useLocation();

  useEffect(() => {
    trackPageviews(location.pathname + location.search, GA_MEASUREMENT_ID);
  }, [location]);

  return (
    <MainLayout>
      {/* Tracks on every route change */}
      <RouteChangeTracker />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/days/:dayNumber" element={<MeditationDayPage />} />
        <Route path="/days/:arcID/:arcDayNumber" element={<MeditationDayPage />} />
        <Route path="/how-to-pray" element={<HowToPrayPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/arcs/:arcId" element={<ArcPage />} />
        <Route path="/my-journey" element={<JourneyPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/start-journey" element={<StartJourneyPage />} />
        <Route path="/my-notes" element={<NotesPage />} />
        <Route path="/create-custom-journey" element={<JourneyEditorPage mode="create" />} />
        <Route
          path="/edit-journey"
          element={
            <JourneyEditorPage
              mode="edit"
              initialJourney={{
                title: activeJourney?.title || "",
                arcs:
                  activeJourney?.arc_progress.map((arc) => ({
                    arc_id: arc.arc_id,
                    arc_title: arc.arc_title,
                    day_count: arc.day_count,
                    anchor_image: [], // Provide default or placeholder value
                    arc_summary: "", // Provide default or placeholder value
                    primary_reading: [], // Provide default or placeholder value
                    card_tags: [], // Provide default or placeholder value
                  })) || [],
              }}
            />
          }
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </MainLayout>
  );
}

// Main App component that just provides the Router
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
