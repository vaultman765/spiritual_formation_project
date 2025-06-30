// App.tsx
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ArcTagsOverview from "./pages/ArcTagsOverview";
import DayIndexPage from "./pages/DayIndexPage";

function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-200 mb-4">
        <Link to="/arc-tags" className="mr-4 font-semibold">Arc Tags</Link>
        <Link to="/days" className="font-semibold">Meditation Days</Link>
      </nav>
      <Routes>
        <Route path="/arc-tags" element={<ArcTagsOverview />} />
        <Route path="/days" element={<DayIndexPage />} />
      </Routes>
    </Router>
  );
}

export default App;
