import { useState } from "react";
import SeoMeta from "@/components/seo/SeoMeta";
import { useAuth } from "@/context/authContext";
import axios from "@/utils/axios";
import { getCSRFToken } from "@/utils/auth/tokens";

export default function AccountPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setSaving(true);

    const API_URL = import.meta.env.VITE_API_URL;
    const csrfToken = getCSRFToken();
    const headers = {
      "X-CSRFToken": csrfToken || "",
      "Content-Type": "application/json",
    };

    try {
      // Check if password change requested
      if (form.newPassword) {
        // Validate passwords match
        if (form.newPassword !== form.confirmPassword) {
          throw new Error("New passwords don't match");
        }

        await axios.post(
          `${API_URL}/api/user/change-password/`,
          {
            current_password: form.currentPassword,
            new_password: form.newPassword,
          },
          {
            headers,
            withCredentials: true,
          }
        );

        // Clear password fields after successful change
        setForm((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));

        setMsg("Password updated successfully");
      } else {
        setMsg("No changes submitted");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.response?.data?.error || err.message || "Update failed";
      setMsg(`Error: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const canonical = "https://www.catholicmentalprayer.com/account";

  return (
    <main>
      <SeoMeta
        title="Account"
        description="Manage your Spiritual Formation Project account."
        canonicalUrl={canonical}
        imageUrl="https://www.catholicmentalprayer.com/images/how_to_pray/prayers/prayers_default_og.jpg"
        type="website"
      />

      <article className="mx-auto max-w-xl px-4 py-8">
        <h1 className="font-display text-3xl text-[var(--text-light)] mb-2">Account</h1>
        <p className="text-[var(--text-muted)] mb-6">Update your password here.</p>

        {/* Display account information as read-only */}
        <div className="space-y-5 mb-6">
          <div>
            <label className="block text-sm text-[var(--text-subtle-heading)] mb-1">Username</label>
            <div className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-[var(--text-light)]">{user?.username}</div>
          </div>
          <div>
            <label className="block text-sm text-[var(--text-subtle-heading)] mb-1">Email</label>
            <div className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-[var(--text-light)]">{user?.email}</div>
          </div>
        </div>

        <hr className="border-white/10 mb-6" />

        <h2 className="text-xl text-[var(--text-light)] mb-4">Change Password</h2>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-[var(--text-subtle-heading)] mb-1">Current password</label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={onChange}
              autoComplete="current-password"
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-[var(--text-light)]"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-[var(--text-subtle-heading)] mb-1">New password</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={onChange}
                autoComplete="new-password"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-[var(--text-light)]"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-subtle-heading)] mb-1">Confirm new password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={onChange}
                autoComplete="new-password"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-[var(--text-light)]"
              />
            </div>
          </div>

          {msg && <p className={`text-sm ${msg.startsWith("Error:") ? "text-red-400" : "text-green-400"}`}>{msg}</p>}

          <button
            disabled={saving}
            className="rounded-lg bg-[var(--brand-primary)]/90 hover:bg-[var(--brand-primary)] px-5 py-2 text-white font-medium disabled:opacity-60"
          >
            {saving ? "Updating Password…" : "Update Password"}
          </button>
        </form>
      </article>
    </main>
  );
}
