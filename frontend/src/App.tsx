// App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "@/components/common/Navbar";
import HomePage from "@/pages/HomePage";
import ExplorePage from "@/pages/ExplorePage";
import MeditationDayPage from "@/pages/MeditationDayPage";
import ArcPage from "@/pages/ArcPage";
import JourneyPage from "@/pages/JourneyPage";
import LoginPage from "@/pages/LoginPage";
import StartJourneyPage from '@/pages/StartJourneyPage';
import CustomJourneyPage from '@/pages/CustomJourneyPage';
import RegisterPage from '@/pages/RegisterPage';

function App() {
  return (
    <Router>

      <Navbar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/days/:dayNumber" element={<MeditationDayPage />} />
        <Route path="/days/:arcID/:arcDayNumber" element={<MeditationDayPage />} />
        <Route path="/how-to-pray" element={<div>How to Pray Page (Coming Soon)</div>} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/arcs/:arcId" element={<ArcPage />} />
        <Route path="/my-journey" element={<JourneyPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/start-journey" element={<StartJourneyPage />} />
        <Route path="/create-custom-journey" element={<CustomJourneyPage />} />

      </Routes>
    </Router>
  );
}

export default App;
