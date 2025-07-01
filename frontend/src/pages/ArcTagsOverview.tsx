import React, { useEffect, useState } from "react";
import ArcTagViewer from "@/components/ArcTagViewer";
import ArcTagFilterBar from "@/components/ArcTagFilterBar";
import type { ArcTag } from "@/utils/types";
// import { Loader } from "@/components/ui/loader";

const ArcTagsOverview: React.FC = () => {
  const [tags, setTags] = useState<ArcTag[]>([]);
  const [filteredTags, setFilteredTags] = useState<ArcTag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/arc-tags/");
        if (!response.ok) throw new Error("Failed to fetch tags");
        const data = await response.json();
        setTags(data);
        setFilteredTags(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleFilter = ({ search, category }: { search: string; category: string }) => {
    const loweredSearch = search.toLowerCase();

    const filtered = tags.filter((arc) => {
      const matchesArc = arc.arc_title.toLowerCase().includes(loweredSearch);
      const matchingTags = arc.tags.filter((tag) => {
        const matchesName = tag.name.toLowerCase().includes(loweredSearch);
        const matchesCategory = category ? tag.category === category : true;
        return matchesName && matchesCategory;
      });
      return matchesArc || matchingTags.length > 0;
    });

    setFilteredTags(filtered);
  };

  return (
  <div className="fixed inset-0 flex flex-col overflow-hidden pt-16">
    {/* Sticky Header */}
    <div className="sticky top-0 z-10 backdrop-blur px-6 pt-6 pb-2 shadow-md">
      <h1 className="text-4xl font-bold mb-4">All Arc Tags</h1>
      <ArcTagFilterBar onFilter={handleFilter} />
    </div>

    {/* Scrollable Content */}
    <div className="flex-1 overflow-y-auto px-6 pb-10">
      {loading ? (
        <div className="text-blue-400">Loading...</div>
      ) : error ? (
        <div className="text-red-400">Error: {error}</div>
      ) : (
        <div className="w-full min-h-[200px] flex justify-center items-start">
          {filteredTags.length === 0 ? (
            <p className="text-sky-300 italic text-lg mt-10">
              No matching arcs or tags found.
            </p>
          ) : (
            <ArcTagViewer tags={filteredTags} enableDescriptions={true} />
          )}
        </div>
      )}
    </div>
  </div>
);
} 

export default ArcTagsOverview;
