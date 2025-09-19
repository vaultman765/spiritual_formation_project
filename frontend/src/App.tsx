// App.tsx
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import MainLayout from "@/layouts/MainLayout";
import { trackPageview } from "@/utils/analytics";
import { useJourney } from "@/context/journeyContext";
import { useAuth } from "@/context/authContext";

// ✅ Lazy load pages
const HomePage = lazy(() => import("@/pages/homepage/HomePage"));
const ExplorePage = lazy(() => import("@/pages/explore/ExplorePage"));
const MeditationDayPage = lazy(() => import("@/pages/meditations/MeditationDayPage"));
const ArcPage = lazy(() => import("@/pages/arcs/ArcPage"));
const JourneyPage = lazy(() => import("@/pages/journey/JourneyPage"));
const LoginPage = lazy(() => import("@/pages/login/LoginPage"));
const StartJourneyPage = lazy(() => import("@/pages/journey/StartJourneyPage"));
const RegisterPage = lazy(() => import("@/pages/login/RegisterPage"));
const NotesPage = lazy(() => import("@/pages/notes/NotesPage"));
const JourneyEditorPage = lazy(() => import("@/pages/journey/JourneyEditorPage"));
const HowToPrayPage = lazy(() => import("@/pages/how_to_pray/HowToPrayPage"));
const InDepthHowToPrayPage = lazy(() => import("@/pages/how_to_pray/InDepthHowToPrayPage"));
const RosaryPage = lazy(() => import("@/pages/how_to_pray/chaplets/RosaryPage"));
const DivineMercyChapletPage = lazy(() => import("@/pages/how_to_pray/chaplets/DivineMercyChapletPage"));
const PrayersIndexPage = lazy(() => import("@/pages/how_to_pray/prayers/PrayersIndexPage"));
const PrayerPage = lazy(() => import("@/pages/how_to_pray/prayers/PrayerPage"));
const AccountPage = lazy(() => import("@/pages/account/AccountPage"));

// ✅ Lazy load Toastify container (so it’s not in the main bundle)
const ToastContainer = lazy(() => import("react-toastify").then((mod) => ({ default: mod.ToastContainer })));

import "react-toastify/dist/ReactToastify.css"; // keep CSS global

import { trackPageviews } from "@/components/seo/ga4";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Tracks route changes
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

function AppRoutes() {
  const { activeJourney } = useJourney();
  const location = useLocation();

  useEffect(() => {
    trackPageviews(location.pathname + location.search, GA_MEASUREMENT_ID);
  }, [location]);

  return (
    <MainLayout>
      <RouteChangeTracker />

      {/* ✅ Wrap routes in Suspense */}
      <Suspense fallback={<div className="text-white text-center py-8">Loading…</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/days/:dayNumber" element={<MeditationDayPage />} />
          <Route path="/days/:arcID/:arcDayNumber" element={<MeditationDayPage />} />
          <Route path="/how-to-pray" element={<HowToPrayPage />} />
          <Route path="/how-to-pray/guide" element={<InDepthHowToPrayPage />} />
          <Route path="/prayers/rosary" element={<RosaryPage />} />
          <Route path="/prayers/divine-mercy-chaplet" element={<DivineMercyChapletPage />} />
          <Route path="/prayers" element={<PrayersIndexPage />} />
          <Route path="/prayers/:slug" element={<PrayerPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/arcs/:arcId" element={<ArcPage />} />
          <Route path="/my-journey" element={<JourneyPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/account" element={<AccountPage />} />
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
                      anchor_image: [],
                      arc_summary: "",
                      primary_reading: [],
                      card_tags: [],
                    })) || [],
                }}
              />
            }
          />
        </Routes>
      </Suspense>

      {/* ✅ Toastify is lazy too */}
      <Suspense fallback={null}>
        <ToastContainer position="top-right" autoClose={3000} />
      </Suspense>
    </MainLayout>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
