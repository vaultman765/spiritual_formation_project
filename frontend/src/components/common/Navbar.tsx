import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/authContext";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [gpOpen, setGpOpen] = useState(false);
  const [flyout, setFlyout] = useState<"guides" | "prayers" | "litanies" | null>(null);

  const [mGpOpen, setMGpOpen] = useState(false);
  const [mGuidesOpen, setMGuidesOpen] = useState(false);
  const [mPrayersOpen, setMPrayersOpen] = useState(false);
  const [mLitaniesOpen, setMLitaniesOpen] = useState(false);

  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to log out. Please try again.");
    }
  };

  const closeTimer = useRef<number | null>(null);
  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      setGpOpen(false);
      setFlyout(null);
    }, 180); // small grace period prevents flicker
  };

  // close on route change
  useEffect(() => {
    setGpOpen(false);
    setFlyout(null);
  }, [location.pathname]);

  // close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setGpOpen(false), setFlyout(null));
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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

          {/* ▼ Dropdown: Guides & Prayers */}
          <div className="relative z-50 hidden sm:block" onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
            <button
              type="button"
              onClick={() => setGpOpen((v) => !v)}
              aria-expanded={gpOpen}
              aria-haspopup="menu"
              className="flex items-center gap-1 text-white hover:text-[var(--brand-primary-dark)]"
            >
              Guides & Prayers
              <svg width="16" height="16" viewBox="0 0 24 24" className={`transition ${gpOpen ? "rotate-180" : ""}`}>
                <path fill="currentColor" d="M7 10l5 5 5-5z" />
              </svg>
            </button>

            {gpOpen && (
              <div
                role="menu"
                className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 rounded-xl border border-white/10
                 bg-[var(--bg-card)]/95 backdrop-blur shadow-xl p-1"
              >
                {/* “Bridge” so there’s no hover gap when moving into flyouts */}
                <div className="pointer-events-none absolute top-0 left-full h-full w-4" />

                <button
                  type="button"
                  onMouseEnter={() => setFlyout("guides")}
                  onClick={() => setFlyout("guides")}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-[var(--text-light)] hover:bg-white/5"
                >
                  Guides <span className="opacity-70">▸</span>
                </button>

                <button
                  type="button"
                  onMouseEnter={() => setFlyout("prayers")}
                  onClick={() => setFlyout("prayers")}
                  className="mt-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-[var(--text-light)] hover:bg-white/5"
                >
                  Prayers <span className="opacity-70">▸</span>
                </button>

                <button
                  type="button"
                  onMouseEnter={() => setFlyout("litanies")}
                  onClick={() => setFlyout("litanies")}
                  className="mt-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-[var(--text-light)] hover:bg-white/5"
                >
                  Litanies <span className="opacity-70">▸</span>
                </button>

                {/* Flyout: Guides */}
                {flyout === "guides" && (
                  <div
                    className="absolute top-0 left-full ml-2 w-64 rounded-xl border border-white/10
                     bg-[var(--bg-card)]/95 backdrop-blur shadow-xl p-2"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    <ul className="space-y-1">
                      <li>
                        <Link
                          to="/how-to-pray"
                          onClick={() => (setGpOpen(false), setFlyout(null))}
                          className="block rounded-lg px-3 py-2 hover:bg-white/5"
                        >
                          Ignatian Mental Prayer
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/prayers/rosary"
                          onClick={() => (setGpOpen(false), setFlyout(null))}
                          className="block rounded-lg px-3 py-2 hover:bg-white/5"
                        >
                          The Holy Rosary
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/prayers/divine-mercy-chaplet"
                          onClick={() => (setGpOpen(false), setFlyout(null))}
                          className="block rounded-lg px-3 py-2 hover:bg-white/5"
                        >
                          Divine Mercy Chaplet
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Flyout: Prayers */}
                {flyout === "prayers" && (
                  <div
                    className="absolute top-0 left-full ml-2 w-64 rounded-xl border border-white/10
                     bg-[var(--bg-card)]/95 backdrop-blur shadow-xl p-2"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    <ul className="space-y-1">
                      <li>
                        <Link
                          to="/prayers/"
                          onClick={() => (setGpOpen(false), setFlyout(null))}
                          className="block rounded-lg px-3 py-2 hover:bg-white/5"
                        >
                          See All prayers
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/prayers/apostles-creed"
                          onClick={() => (setGpOpen(false), setFlyout(null))}
                          className="block rounded-lg px-3 py-2 hover:bg-white/5"
                        >
                          Apostles’ Creed
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/prayers/our-father"
                          onClick={() => (setGpOpen(false), setFlyout(null))}
                          className="block rounded-lg px-3 py-2 hover:bg-white/5"
                        >
                          Our Father
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/prayers/hail-mary"
                          onClick={() => (setGpOpen(false), setFlyout(null))}
                          className="block rounded-lg px-3 py-2 hover:bg-white/5"
                        >
                          Hail Mary
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/prayers/glory-be"
                          onClick={() => (setGpOpen(false), setFlyout(null))}
                          className="block rounded-lg px-3 py-2 hover:bg-white/5"
                        >
                          Glory Be
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/prayers/hail-holy-queen"
                          onClick={() => (setGpOpen(false), setFlyout(null))}
                          className="block rounded-lg px-3 py-2 hover:bg-white/5"
                        >
                          Hail, Holy Queen
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Flyout: litanies */}
                {flyout === "litanies" && (
                  <div
                    className="absolute top-0 left-full ml-2 w-64 rounded-xl border border-white/10
                     bg-[var(--bg-card)]/95 backdrop-blur shadow-xl p-2"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    <ul className="space-y-1">
                      <li>
                        <Link
                          to="/prayers/"
                          onClick={() => (setGpOpen(false), setFlyout(null))}
                          className="block rounded-lg px-3 py-2 hover:bg-white/5"
                        >
                          See All Litanies
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/prayers/litany-sacred-heart"
                          onClick={() => (setGpOpen(false), setFlyout(null))}
                          className="block rounded-lg px-3 py-2 hover:bg-white/5"
                        >
                          The Sacred Heart
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/prayers/litany-precious-blood"
                          onClick={() => (setGpOpen(false), setFlyout(null))}
                          className="block rounded-lg px-3 py-2 hover:bg-white/5"
                        >
                          The Most Precious Blood
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/prayers/litany-immaculate-heart"
                          onClick={() => (setGpOpen(false), setFlyout(null))}
                          className="block rounded-lg px-3 py-2 hover:bg-white/5"
                        >
                          Immaculate Heart of Mary
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/prayers/litany-of-humility"
                          onClick={() => (setGpOpen(false), setFlyout(null))}
                          className="block rounded-lg px-3 py-2 hover:bg-white/5"
                        >
                          Of Humility
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

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

          {/* ▼ Mobile collapsible sub-menu */}
          <div className="border-t border-white/10 pt-3 mt-3">
            <button
              onClick={() => setMGpOpen((v) => !v)}
              aria-expanded={mGpOpen}
              className="flex w-full items-center justify-between text-left"
            >
              <span>Guides & Prayers</span>
              <span className={`transition ${mGpOpen ? "rotate-180" : ""}`}>▾</span>
            </button>

            {mGpOpen && (
              <div className="mt-2 pl-3 space-y-2">
                {/* Guides */}
                <button
                  onClick={() => setMGuidesOpen((v) => !v)}
                  aria-expanded={mGuidesOpen}
                  className="flex w-full items-center justify-between text-left text-white/90"
                >
                  <span>Guides</span>
                  <span className={`transition ${mGuidesOpen ? "rotate-180" : ""}`}>▾</span>
                </button>
                {mGuidesOpen && (
                  <ul className="pl-3 space-y-1">
                    <li>
                      <Link to="/how-to-pray" onClick={() => setIsOpen(false)} className="block py-1">
                        Ignatian Mental Prayer
                      </Link>
                    </li>
                    <li>
                      <Link to="/prayers/rosary" onClick={() => setIsOpen(false)} className="block py-1">
                        The Holy Rosary
                      </Link>
                    </li>
                    <li>
                      <Link to="/prayers/divine-mercy-chaplet" onClick={() => setIsOpen(false)} className="block py-1">
                        Divine Mercy Chaplet
                      </Link>
                    </li>
                  </ul>
                )}

                {/* Prayers */}
                <button
                  onClick={() => setMPrayersOpen((v) => !v)}
                  aria-expanded={mPrayersOpen}
                  className="mt-2 flex w-full items-center justify-between text-left text-white/90"
                >
                  <span>Prayers</span>
                  <span className={`transition ${mPrayersOpen ? "rotate-180" : ""}`}>▾</span>
                </button>
                {mPrayersOpen && (
                  <ul className="pl-3 space-y-1">
                    <li>
                      <Link to="/prayers/" onClick={() => setIsOpen(false)} className="block py-1">
                        See All prayers
                      </Link>
                    </li>
                    <li>
                      <Link to="/prayers/apostles-creed" onClick={() => setIsOpen(false)} className="block py-1">
                        Apostles’ Creed
                      </Link>
                    </li>
                    <li>
                      <Link to="/prayers/our-father" onClick={() => setIsOpen(false)} className="block py-1">
                        Our Father
                      </Link>
                    </li>
                    <li>
                      <Link to="/prayers/hail-mary" onClick={() => setIsOpen(false)} className="block py-1">
                        Hail Mary
                      </Link>
                    </li>
                    <li>
                      <Link to="/prayers/glory-be" onClick={() => setIsOpen(false)} className="block py-1">
                        Glory Be
                      </Link>
                    </li>
                    <li>
                      <Link to="/prayers/hail-holy-queen" onClick={() => setIsOpen(false)} className="block py-1">
                        Hail, Holy Queen
                      </Link>
                    </li>
                  </ul>
                )}
                {/* Litanies */}
                <button
                  onClick={() => setMLitaniesOpen((v) => !v)}
                  aria-expanded={mLitaniesOpen}
                  className="mt-2 flex w-full items-center justify-between text-left text-white/90"
                >
                  <span>Litanies</span>
                  <span className={`transition ${mLitaniesOpen ? "rotate-180" : ""}`}>▾</span>
                </button>
                {mLitaniesOpen && (
                  <ul className="pl-3 space-y-1">
                    <li>
                      <Link to="/prayers/" onClick={() => setIsOpen(false)} className="block py-1">
                        See All litanies
                      </Link>
                    </li>
                    <li>
                      <Link to="/prayers/litany-sacred-heart" onClick={() => setIsOpen(false)} className="block py-1">
                        The Sacred Heart
                      </Link>
                    </li>
                    <li>
                      <Link to="/prayers/litany-precious-blood" onClick={() => setIsOpen(false)} className="block py-1">
                        The Most Precious Blood
                      </Link>
                    </li>
                    <li>
                      <Link to="/prayers/litany-immaculate-heart" onClick={() => setIsOpen(false)} className="block py-1">
                        Immaculate Heart of Mary
                      </Link>
                    </li>
                    <li>
                      <Link to="/prayers/litany-of-humility" onClick={() => setIsOpen(false)} className="block py-1">
                        Of Humility
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>

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
