import { useMemo, useState, useEffect, useRef } from "react";
import { useJourneyEditor } from "@/hooks/useJourneyEditor";
import { saveOrUpdateJourney } from "@/utils/journeyUtils";
import type { ArcData } from "@/utils/types";
import { useJourney } from "@/context/journeyContext";
import { useNavigate } from "react-router-dom";
import SelectableArcCard from "@/components/cards/SelectableArcCard";
import DraggableSelectedGrid from "@/components/dnd/DraggableSelectedGrid";
import { toast } from "react-toastify";

interface JourneyEditorPageProps {
  mode: "create" | "edit";
  initialJourney?: { title: string; arcs: ArcData[] };
}

const PAGE_SIZES = [12, 20, 28, 40, 60];
const DRAFT_KEY = "journeyDraft:v1";

export default function JourneyEditorPage({ mode, initialJourney }: Readonly<JourneyEditorPageProps>) {
  const { availableArcs, selectedArcs, title, setTitle, setSelectedArcs, handleReorder, refreshJourneys } = useJourneyEditor(
    mode === "edit" ? { initialJourney } : {}
  );

  const { createJourney, updateJourney, activeJourney } = useJourney();
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string>("All");
  const [tab, setTab] = useState<"available" | "selected">("available");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const navigate = useNavigate();

  // ---------- prefill in edit mode ----------
  useEffect(() => {
    if (mode === "edit" && activeJourney && availableArcs.length) {
      setTitle(activeJourney.title);
      const selected = activeJourney.arc_progress.map((p) => availableArcs.find((a) => a.arc_id === p.arc_id)).filter(Boolean) as ArcData[];
      setSelectedArcs(selected);
    }
  }, [mode, activeJourney, availableArcs, setSelectedArcs, setTitle]);

  // ---------- tags list ----------
  const allTags = useMemo(() => {
    const t = new Set<string>();
    availableArcs.forEach((a) => a.card_tags?.forEach((x) => t.add(x)));
    return ["All", ...Array.from(t).sort((a, b) => a.localeCompare(b))];
  }, [availableArcs]);

  // ---------- filtering (Available) ----------
  const filteredAvailable = useMemo(() => {
    const s = search.trim().toLowerCase();
    return availableArcs
      .filter((a) => !selectedArcs.some((s) => s.arc_id === a.arc_id))
      .filter((a) => (s ? a.arc_title.toLowerCase().includes(s) || a.card_tags?.some((t) => t.toLowerCase().includes(s)) : true))
      .filter((a) => (tag === "All" ? true : a.card_tags?.includes(tag)));
  }, [availableArcs, selectedArcs, search, tag]);

  // ---------- pagination (Available) ----------
  const pageCount = Math.max(1, Math.ceil(filteredAvailable.length / size));
  const pagedAvailable = useMemo(() => {
    const start = (page - 1) * size;
    return filteredAvailable.slice(start, start + size);
  }, [filteredAvailable, page, size]);

  // ---------- moves ----------
  const addArc = (arc: ArcData) => {
    if (!selectedArcs.some((x) => x.arc_id === arc.arc_id)) setSelectedArcs([...selectedArcs, arc]);
  };
  const removeArc = (arcId: string) => setSelectedArcs(selectedArcs.filter((x) => x.arc_id !== arcId));

  // bulk add from current filter/page (we add **all filtered**, not just current page)
  const addAllFiltered = () => {
    const toAdd = filteredAvailable.filter((a) => !selectedArcs.some((s) => s.arc_id === a.arc_id));
    if (!toAdd.length) return;
    setSelectedArcs([...selectedArcs, ...toAdd]);
    toast.success(`Added ${toAdd.length} arc${toAdd.length === 1 ? "" : "s"}`);
    setTab("selected");
  };

  // bulk clear + undo
  const clearAllSelected = () => {
    if (!selectedArcs.length) return;
    const snapshot = selectedArcs;
    setSelectedArcs([]);
    toast(
      <span>
        Removed all selected arcs.{" "}
        <button className="underline" onClick={() => setSelectedArcs(snapshot)}>
          Undo
        </button>
      </span>,
      { autoClose: 4000 }
    );
  };

  // ---------- validation + save ----------
  const isValid = title.trim().length >= 3 && selectedArcs.length > 0;

  const handleSave = async () => {
    if (!isValid) return;
    try {
      await saveOrUpdateJourney({
        journeyId: mode === "edit" ? activeJourney?.id : undefined,
        title: title.trim(),
        arcs: selectedArcs,
        createJourney: mode === "create" ? createJourney : undefined,
        updateJourney: mode === "edit" ? updateJourney : undefined,
      });
      await refreshJourneys();
      // clear draft on success
      if (mode === "create") localStorage.removeItem(DRAFT_KEY);
      navigate("/my-journey");
    } catch (e) {
      console.error("Failed to save journey:", e);
      toast.error("Could not save. Please try again.");
    }
  };

  // ---------- autosave draft (create mode) ----------
  useEffect(() => {
    if (mode !== "create") return;
    // load once
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      try {
        const draft = JSON.parse(raw) as { title?: string; arcIds?: string[] };
        if (draft.title) setTitle(draft.title);
        if (draft.arcIds?.length) {
          const arcs = draft.arcIds.map((id) => availableArcs.find((a) => a.arc_id === id)).filter(Boolean) as ArcData[];
          if (arcs.length) setSelectedArcs(arcs);
        }
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, availableArcs.length]);

  useEffect(() => {
    if (mode !== "create") return;
    const payload = { title, arcIds: selectedArcs.map((a) => a.arc_id) };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  }, [mode, title, selectedArcs]);

  // ---------- unsaved changes guard (tab close/back/refresh) ----------
  const initialSnapshot = useRef<string>("");
  // snapshot after first render/prefill
  useEffect(() => {
    initialSnapshot.current = JSON.stringify({ title, ids: selectedArcs.map((a) => a.arc_id) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // once

  const isDirty = useMemo(() => {
    const now = JSON.stringify({ title, ids: selectedArcs.map((a) => a.arc_id) });
    return now !== initialSnapshot.current;
  }, [title, selectedArcs]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  return (
    <main>
      {/* Sticky action bar (keeps your page layout intact) */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-[var(--bg-dark)]/80 backdrop-blur border-t border-white/10">
        <div className="mx-auto max-w-6xl px-3 py-2 flex items-center justify-between gap-3">
          <div className="text-xs text-[var(--text-muted)]">
            {selectedArcs.length} arc{selectedArcs.length === 1 ? "" : "s"} selected
            {isDirty ? " • Unsaved changes" : ""}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/my-journey")}
              className="rounded-lg border border-white/20 px-4 py-2 text-[var(--text-muted)] hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isValid}
              className={`rounded-lg px-5 py-2 font-semibold ${
                isValid ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "bg-white/10 text-[var(--text-muted)] cursor-not-allowed"
              }`}
            >
              {mode === "create" ? "Create Journey" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-display font-semibold text-[var(--text-light)]">
          {mode === "create" ? "Create a Custom Journey" : "Edit Custom Journey"}
        </h1>
        <p className="mt-3 text-[var(--text-muted)]">
          {mode === "create"
            ? "Choose arcs like you would on Explore. Add them to your journey, then save."
            : "Add, remove, or reorder arcs. Your current selections are on the Selected tab."}
        </p>
      </header>

      {/* Title + tabs */}
      <section className="mx-auto mb-4 flex max-w-5xl flex-col items-stretch gap-3 px-4 sm:flex-row sm:items-center sm:justify-center">
        <input
          type="text"
          placeholder="Journey Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-style w-full sm:w-[320px]"
        />

        <div className="rounded-full p-1 text-sm">
          <button
            className={`rounded-full border border-white/15 px-4 py-2 mb-2 ${
              tab === "available" ? "bg-white/10 text-white" : "text-[var(--text-muted)]"
            }`}
            onClick={() => setTab("available")}
          >
            Available
          </button>
          <button
            className={`rounded-full border border-white/15 px-4 py-2 ${
              tab === "selected" ? "bg-white/10 text-white" : "text-[var(--text-muted)]"
            }`}
            onClick={() => setTab("selected")}
          >
            Selected ({selectedArcs.length})
          </button>
        </div>
      </section>

      {/* AVAILABLE controls */}
      {tab === "available" && (
        <section className="mx-auto mb-4 flex max-w-5xl flex-wrap items-center gap-3 px-4">
          <input
            type="text"
            placeholder="Search arcs…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="input-style flex-1 min-w-[220px]"
          />
          <select
            value={tag}
            onChange={(e) => {
              setTag(e.target.value);
              setPage(1);
            }}
            className="input-style !px-3 !py-2 !w-auto"
          >
            {allTags.map((t) => (
              <option key={t} value={t} className="text-black bg-white">
                {t}
              </option>
            ))}
          </select>

          <div className="ml-auto flex items-center gap-2">
            <button
              className="rounded border border-white/20 px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-white/5"
              onClick={addAllFiltered}
              disabled={filteredAvailable.length === 0}
            >
              Add all filtered
            </button>

            <span className="text-sm text-[var(--text-muted)]">Show</span>
            <select
              className="input-style !w-auto !px-2 !py-2"
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {PAGE_SIZES.map((n) => (
                <option key={n} value={n} className="text-black bg-white">
                  {n}
                </option>
              ))}
            </select>
            <span className="text-sm text-[var(--text-muted)]">per page</span>
          </div>
        </section>
      )}

      {/* GRID */}
      <section className="mx-auto max-w-7xl px-4 pb-28">
        {/* pb so content isn’t hidden by sticky bar */}
        {(() => {
          let content;
          if (tab === "available") {
            content = (
              <>
                <p className="mb-2 text-center text-sm text-[var(--text-muted)]">
                  Showing {filteredAvailable.length ? (page - 1) * size + 1 : 0}–{Math.min(page * size, filteredAvailable.length)} of{" "}
                  {filteredAvailable.length} arcs
                </p>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {pagedAvailable.map((arc) => (
                    <SelectableArcCard key={arc.arc_id} arc={arc} onAdd={addArc} />
                  ))}
                </div>

                {pageCount > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                      className="rounded border border-white/20 px-3 py-1 text-sm text-[var(--text-muted)] hover:bg-white/5"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      ← Prev
                    </button>
                    <span className="text-sm text-[var(--text-muted)]">
                      Page {page} of {pageCount}
                    </span>
                    <button
                      className="rounded border border-white/20 px-3 py-1 text-sm text-[var(--text-muted)] hover:bg-white/5"
                      disabled={page === pageCount}
                      onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            );
          } else if (selectedArcs.length === 0) {
            content = <p className="text-center text-[var(--text-muted)]">No arcs selected yet. Add from the “Available” tab.</p>;
          } else {
            content = (
              <>
                <div className="mb-3 flex justify-end">
                  <button
                    className="rounded border border-white/20 px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-white/5"
                    onClick={clearAllSelected}
                  >
                    Clear all
                  </button>
                </div>
                <DraggableSelectedGrid items={selectedArcs} onRemove={removeArc} onReorder={handleReorder} />
              </>
            );
          }
          return content;
        })()}
      </section>
    </main>
  );
}
