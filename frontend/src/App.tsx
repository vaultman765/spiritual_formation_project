// App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Link } from 'react-router-dom';
import ArcTagsOverview from "@/pages/ArcTagsOverview";
import DayIndexPage from "@/pages/DayIndexPage";
import HomePage from "@/pages/HomePage";
import DayDetailPage from "@/pages/DayDetailsPage";
import JourneyPage from "@/pages/JourneyPage";


function App() {
  return (
    <Router>
      <nav className="flex justify-between items-center px-6 py-1 text-sm text-[var(--brand-primary)] bg-[var(--bg-light)]">
        <span className="font-semibold uppercase tracking-wide">Mental Prayer</span>
        <div className="space-x-6">
          <Link to="#" className="hover:text-[var(--brand-primary-dark)] transition-colors duration-150">Today</Link>
          <Link to="/arcs" className="hover:text-[var(--brand-primary-dark)] transition-colors duration-150">Journey</Link>
          <Link to="#" className="hover:text-[var(--brand-primary-dark)] transition-colors duration-150">Tags</Link>
          <Link to="#" className="hover:text-[var(--brand-primary-dark)] transition-colors duration-150">How to Pray</Link>
        </div>
      </nav>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/arcs" element={<JourneyPage />} />

        <Route path="/arc-tags" element={<ArcTagsOverview />} />
        <Route path="/days" element={<DayIndexPage />} />
        <Route path="/days/:dayNumber" element={<DayDetailPage />} />
        <Route path="/arcs/:arcId/days/:arcDayNumber" element={<DayDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
