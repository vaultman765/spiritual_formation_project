// App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Navbar from "@/components/common/Navbar";
import HomePage from "@/pages/homepage/HomePage";
import ExplorePage from "@/pages/explore/ExplorePage";
import MeditationDayPage from "@/pages/meditations/MeditationDayPage";
import ArcPage from "@/pages/arcs/ArcPage";
import JourneyPage from "@/pages/journey/JourneyPage";
import LoginPage from "@/pages/login/LoginPage";
import StartJourneyPage from "@/pages/journey/StartJourneyPage";
import CustomJourneyPage from "@/pages/journey/CustomJourneyPage";
import RegisterPage from "@/pages/login/RegisterPage";
import NotesPage from "@/pages/notes/NotesPage";
import CustomJourneyEditor from "@/pages/journey/EditCustomJourneyPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/days/:dayNumber" element={<MeditationDayPage />} />
          <Route
            path="/days/:arcID/:arcDayNumber"
            element={<MeditationDayPage />}
          />
          <Route
            path="/how-to-pray"
            element={<div>How to Pray Page (Coming Soon)</div>}
          />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/arcs/:arcId" element={<ArcPage />} />
          <Route path="/my-journey" element={<JourneyPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/start-journey" element={<StartJourneyPage />} />
          <Route
            path="/create-custom-journey"
            element={<CustomJourneyPage />}
          />
          <Route path="/edit-journey" element={<CustomJourneyEditor />} />
          <Route path="/my-notes" element={<NotesPage />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </MainLayout>
    </Router>
  );
}

export default App;
