import { Link } from "react-router-dom";

const NavigationBar = () => (
    <div className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur px-4 py-2 text-sm text-blue-300 shadow-md">
    <Link to="/" className="text-blue-400 hover:underline">Home</Link> ·{" "}
    <Link to="/arc-tags" className="text-blue-400 hover:underline">Arc</Link> ·{" "}
    <Link to="/tags" className="text-blue-400 hover:underline">Tags</Link> ·{" "}
    <Link to="/days" className="text-blue-400 hover:underline">Meditation Days</Link>
  </div>
);

export default NavigationBar;