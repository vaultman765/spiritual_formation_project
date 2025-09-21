import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/authContext";
import { Link, useLocation } from "react-router-dom";
import AccountMenu from "@/components/nav/AccountMenu";

/** Small helpers for the dropdown UI */
function Dropdown({ label, children }: Readonly<{ label: string | React.ReactNode; children: React.ReactNode }>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // close on outside click + Esc
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[var(--gray-100)] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {label}
        <svg viewBox="0 0 20 20" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
          <path fill="currentColor" d="M5.3 7.3a1 1 0 011.4 0L10 10.6l3.3-3.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4z" />
        </svg>
      </button>

      <div
        role="menu"
        className={`absolute right-0 z-30 mt-2 w-[22rem] max-h-[75vh] overflow-auto rounded-xl border border-white/10 bg-[var(--bg-card)]/95 p-2 shadow-xl shadow-black/30 backdrop-blur ${
          open ? "block" : "hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Item({ to, children, onClick }: Readonly<{ to: string; children: React.ReactNode; onClick?: () => void }>) {
  return (
    <Link
      to={to}
      onClick={onClick}
      role="menuitem"
      className="block rounded-md px-3 py-2 text-[var(--text-main)] hover:bg-white/10 hover:text-white"
    >
      {children}
    </Link>
  );
}

function SectionTitle({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle-heading)]">{children}</div>;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // mobile panel
  const location = useLocation();

  useEffect(() => setIsOpen(false), [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <nav className="bg-[var(--bg-light)]/95 text-[var(--brand-primary)]">
      <div className="flex w-full items-center justify-between px-4 sm:px-6 py-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/favicon-96x96.png" alt="Spiritual Formation Project" className="h-10 w-10" />
          <span className="hidden sm:inline-block font-display text-lg font-semibold tracking-wide text-white">
            Spiritual Formation Project
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-4 sm:flex">
          <Link to="/" className="px-2 py-1.5 text-[var(--gray-100)] hover:text-white">
            Home
          </Link>

          {/* Journey dropdown (Explore, My Journey, My Notes) */}
          <Dropdown label="Journey">
            <Item to="/explore">Explore</Item>
            <Item to="/my-journey">My Journey</Item>
            <Item to="/my-notes">My Notes</Item>
          </Dropdown>

          {/* Guides & Prayers dropdown (ALL your options) */}
          <Dropdown label="Guides & Prayers">
            {/* Guides */}
            <SectionTitle>Guides</SectionTitle>
            <Item to="/how-to-pray">Ignatian Mental Prayer</Item>
            <Item to="/how-to-pray/guide">In-Depth How to Pray</Item>
            <Item to="/prayers/rosary">How to Pray the Rosary</Item>
            <Item to="/prayers/divine-mercy-chaplet">Divine Mercy Chaplet</Item>

            <div className="my-2 border-t border-white/10" />

            {/* Prayers */}
            <SectionTitle>Prayers</SectionTitle>
            <Item to="/prayers">See all prayers</Item>
            <Item to="/prayers/apostles-creed">Apostles’ Creed</Item>
            <Item to="/prayers/our-father">Our Father</Item>
            <Item to="/prayers/hail-mary">Hail Mary</Item>
            <Item to="/prayers/glory-be">Glory Be</Item>
            <Item to="/prayers/hail-holy-queen">Hail, Holy Queen</Item>

            <div className="my-2 border-t border-white/10" />

            {/* Litanies */}
            <SectionTitle>Litanies</SectionTitle>
            <Item to="/prayers">See all litanies</Item>
            <Item to="/prayers/litany-sacred-heart">Litany of the Sacred Heart</Item>
            <Item to="/prayers/litany-precious-blood">Litany of the Most Precious Blood</Item>
            <Item to="/prayers/litany-immaculate-heart">Litany of the Immaculate Heart</Item>
            <Item to="/prayers/litany-of-humility">Litany of Humility</Item>
          </Dropdown>

          {/* Account */}
          <AccountMenu />
        </div>

        {/* Mobile hamburger */}
        <button className="sm:hidden text-white" onClick={() => setIsOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={isOpen}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="6" width="16" height="2" rx="1" fill="currentColor" />
            <rect x="4" y="11" width="16" height="2" rx="1" fill="currentColor" />
            <rect x="4" y="16" width="16" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* Mobile panel (collapsible sections mirroring desktop lists) */}
      {isOpen && (
        <div className="sm:hidden border-t border-white/10 bg-[var(--bg-light)]/95 px-6 pb-4 pt-2">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block rounded-md px-3 py-2 text-[var(--gray-100)] hover:bg-white/10 hover:text-white"
          >
            Home
          </Link>

          <details className="mt-1 rounded-md">
            <summary className="cursor-pointer list-none rounded-md px-3 py-2 text-[var(--gray-100)] hover:bg-white/10 hover:text-white">
              Journey
            </summary>
            <div className="mt-1 space-y-1 pl-3">
              <Link to="/explore" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 hover:bg-white/10">
                Explore
              </Link>
              <Link to="/my-journey" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 hover:bg-white/10">
                My Journey
              </Link>
              <Link to="/my-notes" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 hover:bg-white/10">
                My Notes
              </Link>
            </div>
          </details>

          <details className="mt-1 rounded-md">
            <summary className="cursor-pointer list-none rounded-md px-3 py-2 text-[var(--gray-100)] hover:bg-white/10 hover:text-white">
              Guides & Prayers
            </summary>
            <div className="mt-1 space-y-2 pl-3">
              {/* Guides */}
              <div>
                <div className="px-3 py-1 text-xs uppercase tracking-wider text-[var(--text-subtle-heading)]">Guides</div>
                <Link to="/how-to-pray" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 hover:bg-white/10">
                  Ignatian Mental Prayer
                </Link>
                <Link to="/how-to-pray/guide" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 hover:bg-white/10">
                  In-Depth How to Pray
                </Link>
                <Link to="/prayers/rosary" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 hover:bg-white/10">
                  How to Pray the Rosary
                </Link>
                <Link
                  to="/prayers/divine-mercy-chaplet"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2 hover:bg-white/10"
                >
                  Divine Mercy Chaplet
                </Link>
              </div>

              {/* Prayers */}
              <div>
                <div className="px-3 py-1 text-xs uppercase tracking-wider text-[var(--text-subtle-heading)]">Prayers</div>
                <Link to="/prayers" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 hover:bg-white/10">
                  See all prayers
                </Link>
                <Link
                  to="/prayers/apostles-creed"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2 hover:bg-white/10"
                >
                  Apostles’ Creed
                </Link>
                <Link to="/prayers/our-father" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 hover:bg-white/10">
                  Our Father
                </Link>
                <Link to="/prayers/hail-mary" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 hover:bg-white/10">
                  Hail Mary
                </Link>
                <Link to="/prayers/glory-be" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 hover:bg-white/10">
                  Glory Be
                </Link>
                <Link
                  to="/prayers/hail-holy-queen"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2 hover:bg-white/10"
                >
                  Hail, Holy Queen
                </Link>
              </div>

              {/* Litanies */}
              <div>
                <div className="px-3 py-1 text-xs uppercase tracking-wider text-[var(--text-subtle-heading)]">Litanies</div>
                <Link to="/prayers" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 hover:bg-white/10">
                  See all litanies
                </Link>
                <Link
                  to="/prayers/litany-sacred-heart"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2 hover:bg-white/10"
                >
                  Sacred Heart
                </Link>
                <Link
                  to="/prayers/litany-precious-blood"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2 hover:bg-white/10"
                >
                  Most Precious Blood
                </Link>
                <Link
                  to="/prayers/litany-immaculate-heart"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2 hover:bg-white/10"
                >
                  Immaculate Heart
                </Link>
                <Link
                  to="/prayers/litany-of-humility"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2 hover:bg-white/10"
                >
                  Litany of Humility
                </Link>
              </div>
            </div>
          </details>

          <details className="mt-1 rounded-md">
            <summary className="cursor-pointer list-none rounded-md px-3 py-2 text-[var(--gray-100)] hover:bg-white/10 hover:text-white">
              Account
            </summary>
            <div className="mt-1 space-y-1 pl-3">
              {user ? (
                <>
                  <div className="px-3 py-1 text-xs text-[var(--text-muted)]">Signed in as {user.username}</div>
                  <Link to="/account" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 hover:bg-white/10">
                    Edit account
                  </Link>
                  <Link to="/my-notes" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 hover:bg-white/10">
                    My Notes
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="block w-full rounded-md px-3 py-2 text-left text-[var(--text-main)] hover:bg-white/10 hover:text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth/login" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 hover:bg-white/10">
                    Login
                  </Link>
                  <Link to="/auth/register" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 hover:bg-white/10">
                    Register
                  </Link>
                </>
              )}
            </div>
          </details>
        </div>
      )}
    </nav>
  );
}
