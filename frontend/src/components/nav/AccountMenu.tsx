import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/authContext";

type ItemProps = Readonly<{
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}>;

function Item({ to, children, onClick }: ItemProps) {
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

export default function AccountMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!popRef.current || !btnRef.current) return;
      if (popRef.current.contains(e.target as Node) || btnRef.current.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 text-white hover:text-[var(--brand-primary-dark)]"
      >
        Account
        <svg width="16" height="16" viewBox="0 0 24 24" className={`transition ${open ? "rotate-180" : ""}`}>
          <path fill="currentColor" d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {open && (
        <div
          ref={popRef}
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-[var(--bg-card)]/95 backdrop-blur shadow-xl p-1 z-50"
        >
          {user ? (
            <ul className="py-1 text-[var(--text-light)]">
              <li className="px-3 py-2 text-sm text-[var(--text-muted)]">
                Signed in as <b>{user.username}</b>
              </li>
              <li>
                <Item to="/account">Edit account</Item>
              </li>
              <li>
                <Item to="/my-notes">My Notes</Item>
              </li>
              <li>
                <button onClick={logout} className="w-full text-left rounded-lg px-3 py-2 hover:bg-white/5">
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <ul className="py-1 text-[var(--text-light)]">
              <li>
                <Item to="/auth/login">Login</Item>
              </li>
              <li>
                <Item to="/auth/register">Register</Item>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
