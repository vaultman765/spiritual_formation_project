// App.tsx
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ArcTagsOverview from "./pages/ArcTagsOverview";
import DayIndexPage from "./pages/DayIndexPage";
import HomePage from "./pages/LandingPage";
import DayDetailPage from "./pages/DayDetailsPage";

function App() {
  return (
    <Router>
      <div className="sticky top-0 z-10 bg-black/70 backdrop-blur px-4 py-2 text-sm text-blue-300 rounded-b-md mb-4 shadow-md">
        <a href="/" className="text-blue-400 hover:underline">Home</a> ·{" "}
        <a href="/arc-tags" className="text-blue-400 hover:underline">Arc</a> ·{" "}
        <a href="/tags" className="text-blue-400 hover:underline">Tags</a> ·{" "}
        <a href="/days" className="text-blue-400 hover:underline">Meditation Days</a>
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/arc-tags" element={<ArcTagsOverview />} />
        <Route path="/days" element={<DayIndexPage />} />
        <Route path="/days/:dayNumber" element={<DayDetailPage />} />
        <Route path="/arcs/:arcId/days/:arcDayNumber" element={<DayDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
