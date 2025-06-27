import React, { useEffect, useState } from "react";

type Tag = {
  id: number;
  name: string;
  category: string;
};

type ArcTag = {
  arc_id: string;
  arc_title: string;
  arc_number: number;
  tags: Tag[];
};

export const ArcTagViewer = () => {
  const [arcTags, setArcTags] = useState<ArcTag[]>([]);

  useEffect(() => {
    fetch("/api/arc-tags/")  // ← assumes Django serves this JSON endpoint
      .then((res) => res.json())
      .then((data) => setArcTags(data))
      .catch((err) => console.error("Error fetching arc tags", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Arc Tags Overview</h1>
      {arcTags.map((arc) => (
        <div key={arc.arc_id} className="mb-6">
          <h2 className="text-xl font-semibold">{arc.arc_title}</h2>
          <ul className="flex flex-wrap gap-2 mt-2">
            {arc.tags.map((tag) => (
              <li
                key={tag.id}
                className="bg-gray-200 px-3 py-1 rounded-full text-sm"
              >
                {tag.name} <span className="text-gray-500">({tag.category})</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
