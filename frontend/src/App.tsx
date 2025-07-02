// App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar";
import ArcTagsOverview from "./pages/ArcTagsOverview";
import DayIndexPage from "./pages/DayIndexPage";
import HomePage from "./pages/LandingPage";
import DayDetailPage from "./pages/DayDetailsPage";


function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        <NavigationBar />
          <main className="flex-1 overflow-y-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/arc-tags" element={<ArcTagsOverview />} />
            <Route path="/days" element={<DayIndexPage />} />
            <Route path="/days/:dayNumber" element={<DayDetailPage />} />
            <Route path="/arcs/:arcId/days/:arcDayNumber" element={<DayDetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
