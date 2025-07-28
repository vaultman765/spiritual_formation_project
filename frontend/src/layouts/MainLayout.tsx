import Navbar from "@/components/common/Navbar";
import ScrollToTop from "@/components/common/ScrollToTop";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="main-background">
      <Navbar />
      <ScrollToTop />
      <main className="px-6 py-4">{children}</main>
      <footer className="text-center py-4 text-[var(--text-muted)]">
        © 2025 Spiritual Formation Project
      </footer>
    </div>
  );
}
