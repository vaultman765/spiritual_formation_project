import { useMemo, useState, useEffect } from "react";
import { useJourneyEditor } from "@/hooks/useJourneyEditor";
import { saveOrUpdateJourney } from "@/utils/journeyUtils";
import type { ArcData } from "@/utils/types";
import { useJourney } from "@/context/journeyContext";
import { useNavigate } from "react-router-dom";
import SelectableArcCard from "@/components/cards/SelectableArcCard";
import DraggableSelectedGrid from "@/components/dnd/DraggableSelectedGrid";

interface JourneyEditorPageProps {
  mode: "create" | "edit";
  initialJourney?: { title: string; arcs: ArcData[] };
}

const PAGE_SIZES = [12, 20, 28, 40, 60];

export default function JourneyEditorPage({ mode, initialJourney }: JourneyEditorPageProps) {
  const {
    availableArcs,
    selectedArcs,
    title,
    setTitle,
    setSelectedArcs,
    handleReorder, // still available if you later re-add drag-drop
    refreshJourneys,
  } = useJourneyEditor(mode === "edit" ? { initialJourney } : {});

  const { createJourney, updateJourney, activeJourney } = useJourney();
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string>("All");
  const [tab, setTab] = useState<"available" | "selected">("available");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const navigate = useNavigate();

  // preload edit mode selection
  useEffect(() => {
    if (mode === "edit" && activeJourney && availableArcs.length) {
      setTitle(activeJourney.title);
      const selected = activeJourney.arc_progress.map((p) => availableArcs.find((a) => a.arc_id === p.arc_id)).filter(Boolean) as ArcData[];
      setSelectedArcs(selected);
    }
  }, [mode, activeJourney, availableArcs]);

  // tags list
  const allTags = useMemo(() => {
    const t = new Set<string>();
    availableArcs.forEach((a) => a.card_tags?.forEach((x) => t.add(x)));
    return ["All", ...Array.from(t).sort((a, b) => a.localeCompare(b))];
  }, [availableArcs]);

  // filter available list
  const filteredAvailable = useMemo(() => {
    const s = search.trim().toLowerCase();
    return availableArcs
      .filter((a) => !selectedArcs.some((s) => s.arc_id === a.arc_id))
      .filter((a) => (s ? a.arc_title.toLowerCase().includes(s) || a.card_tags?.some((t) => t.toLowerCase().includes(s)) : true))
      .filter((a) => (tag === "All" ? true : a.card_tags?.includes(tag)));
  }, [availableArcs, selectedArcs, search, tag]);

  // simple client-side pagination (mirrors Explore experience)
  const pageCount = Math.max(1, Math.ceil(filteredAvailable.length / size));
  const pagedAvailable = useMemo(() => {
    const start = (page - 1) * size;
    return filteredAvailable.slice(start, start + size);
  }, [filteredAvailable, page, size]);

  // moves
  const addArc = (arc: ArcData) => {
    if (!selectedArcs.some((x) => x.arc_id === arc.arc_id)) setSelectedArcs([...selectedArcs, arc]);
  };
  const removeArc = (arcId: string) => setSelectedArcs(selectedArcs.filter((x) => x.arc_id !== arcId));

  const handleSave = async () => {
    if (selectedArcs.length === 0) return;
    try {
      await saveOrUpdateJourney({
        journeyId: mode === "edit" ? activeJourney?.id : undefined,
        title,
        arcs: selectedArcs,
        createJourney: mode === "create" ? createJourney : undefined,
        updateJourney: mode === "edit" ? updateJourney : undefined,
      });
      await refreshJourneys();
      navigate("/my-journey");
    } catch (e) {
      console.error("Failed to save journey:", e);
    }
  };

  return (
    <main>
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

      {/* Title + controls */}
      <section className="mx-auto mb-4 flex max-w-5xl flex-col items-stretch gap-3 px-4 sm:flex-row sm:items-center sm:justify-center">
        <input
          type="text"
          placeholder="Journey Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-style w-full sm:w-[320px]"
        />

        {/* Tabs */}
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

      {/* Filters for AVAILABLE tab */}
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

          {/* per-page */}
          <div className="ml-auto flex items-center gap-2">
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

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4">
        {tab === "available" ? (
          <>
            {/* count */}
            <p className="mb-2 text-center text-sm text-[var(--text-muted)]">
              Showing {filteredAvailable.length ? (page - 1) * size + 1 : 0}–{Math.min(page * size, filteredAvailable.length)} of{" "}
              {filteredAvailable.length} arcs
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {pagedAvailable.map((arc) => (
                <SelectableArcCard key={arc.arc_id} arc={arc} onAdd={addArc} />
              ))}
            </div>

            {/* pagination */}
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
        ) : (
          // SELECTED tab
          <>
            {selectedArcs.length === 0 ? (
              <p className="text-center text-[var(--text-muted)]">No arcs selected yet. Add from the “Available” tab.</p>
            ) : (
              <DraggableSelectedGrid items={selectedArcs} onRemove={removeArc} onReorder={handleReorder} />
            )}
          </>
        )}
      </section>

      {/* Actions */}
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button onClick={handleSave} className="rounded-xl bg-yellow-500 px-8 py-3 font-semibold text-black shadow-md hover:bg-yellow-600">
          {mode === "create" ? "Create Journey" : "Save Changes"}
        </button>
        <button
          onClick={() => navigate("/my-journey")}
          className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10"
        >
          Cancel
        </button>
      </div>
    </main>
  );
}
