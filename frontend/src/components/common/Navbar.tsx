import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <nav className="bg-[var(--bg-light)] text-[var(--brand-primary)] px-6 py-2">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/images/favicon-96x96.png" alt="Spiritual Formation Project" className="h-10 sm:h-12 w-auto" />
          <span className="hidden sm:inline-block font-display font-semibold tracking-wide text-lg text-white">
            Spiritual Formation Project
          </span>
        </Link>

        {/* Hamburger (mobile only) */}
        <button className="sm:hidden text-white text-2xl focus:outline-none" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            className="h-7 w-7"
          >
            <rect x="4" y="6" width="16" height="2" rx="1" fill="currentColor" />
            <rect x="4" y="11" width="16" height="2" rx="1" fill="currentColor" />
            <rect x="4" y="16" width="16" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>

        {/* Links (desktop only) */}
        <div className="hidden sm:flex space-x-6 items-center">
          <Link to="/" className="hover:text-[var(--brand-primary-dark)]">
            Home
          </Link>
          <Link to="/explore" className="hover:text-[var(--brand-primary-dark)]">
            Explore
          </Link>
          <Link to="/my-journey" className="hover:text-[var(--brand-primary-dark)]">
            My Journey
          </Link>
          <Link to="/how-to-pray" className="hover:text-[var(--brand-primary-dark)]">
            How to Pray
          </Link>
          <Link to="/my-notes" className="hover:text-[var(--brand-primary-dark)]">
            My Notes
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-[var(--gray-100)]">Welcome, {user.username}</span>
              <button onClick={handleLogout} className="text-[var(--gray-100)] border border-white/30 rounded px-3 py-1 hover:bg-white/10">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link to="/auth/login" className="hover:text-white">
                Login
              </Link>
              <Link to="/auth/register" className="hover:text-white">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="sm:hidden flex flex-col space-y-4 mt-4">
          <Link to="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link to="/explore" onClick={() => setIsOpen(false)}>
            Explore
          </Link>
          <Link to="/my-journey" onClick={() => setIsOpen(false)}>
            My Journey
          </Link>
          <Link to="/how-to-pray" onClick={() => setIsOpen(false)}>
            How to Pray
          </Link>
          <Link to="/my-notes" onClick={() => setIsOpen(false)}>
            My Notes
          </Link>

          {user ? (
            <>
              <span className="text-white/70">Welcome, {user.username}</span>
              <button
                onClick={handleLogout}
                className="text-white border border-white/30 rounded px-3 py-1 hover:bg-white/10"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link to="/auth/register" onClick={() => setIsOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
