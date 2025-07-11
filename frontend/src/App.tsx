// App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Link } from 'react-router-dom';
import HomePage from "@/pages/HomePage";
import ExplorePage from "@/pages/ExplorePage";
import MeditationDayPage from "@/pages/MeditationDayPage";
import ArcPage from "@/pages/ArcPage";
import JourneyPage from "@/pages/JourneyPage";
import LoginPage from "@/pages/LoginPage";

function App() {
  return (
    <Router>
      <nav className="flex justify-between items-center px-6 py-1 text-sm text-[var(--brand-primary)] bg-[var(--bg-light)]">
        <span className="font-semibold uppercase tracking-wide">Mental Prayer</span>
        <div className="space-x-6">
          <Link to="/" className="hover:text-[var(--brand-primary-dark)] transition-colors duration-150">Home</Link>
          <Link to="#" className="hover:text-[var(--brand-primary-dark)] transition-colors duration-150">Today</Link>
          <Link to="/explore" className="hover:text-[var(--brand-primary-dark)] transition-colors duration-150">Explore</Link>
           <Link to="/my-journey" className="hover:text-[var(--brand-primary-dark)] transition-colors duration-150">Journey</Link>
          <Link to="#" className="hover:text-[var(--brand-primary-dark)] transition-colors duration-150">Tags</Link>
          <Link to="/how-to-pray" className="hover:text-[var(--brand-primary-dark)] transition-colors duration-150">How to Pray</Link>
          <Link to="/auth/login" className="hover:text-[var(--brand-primary-dark)] transition-colors duration-150">Login</Link>     
        </div>
      </nav>
      
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

      </Routes>
    </Router>
  );
}

export default App;
