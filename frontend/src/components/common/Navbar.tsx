import { useAuth } from '@/context/authContext';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <nav
      className="flex justify-between items-center px-6 py-1 text-sm text-[var(--brand-primary)] bg-[var(--bg-light)]"
      role="navigation"
      aria-label="Main Navigation"
    >
      {/* Logo */}
      <span className="font-semibold uppercase tracking-wide">Mental Prayer</span>

      {/* Navigation Links */}
      <div className="space-x-6 flex items-center">
        <Link to="/" className="hover:text-[var(--brand-primary-dark)] transition-colors duration-150">
          Home
        </Link>
        <Link to="/explore" className="hover:text-[var(--brand-primary-dark)] transition-colors duration-150">
          Explore
        </Link>
        <Link to="/my-journey" className="hover:text-[var(--brand-primary-dark)] transition-colors duration-150">
          My Journey
        </Link>
        <Link to="/how-to-pray" className="hover:text-[var(--brand-primary-dark)] transition-colors duration-150">
          How to Pray
        </Link>
        <Link to="/my-notes" className="hover:text-[var(--brand-primary-dark)] transition-colors duration-150">
          My Notes
        </Link>

        {/* User Authentication Links */}
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-white/70">Welcome, {user.username}</span>
            <button
              onClick={handleLogout}
              className="text-white border border-white/30 rounded px-3 py-1 hover:bg-white/10"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/auth/login" className="hover:text-white" aria-label="Login">
              Login
            </Link>
            <Link to="/auth/register" className="hover:text-white" aria-label="Register">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}