import React from "react";
import tagDescriptions from "@/utils/tagDescriptions";
import { categoryColors } from "@/utils/constants";
import type { ArcTag } from "@/utils/types";

type ArcTagViewerProps = {
  tags: ArcTag[];
  enableDescriptions?: boolean;
};

/**
 * ArcTagViewer component displays a list of arcs with their associated tags.
 * Each arc is displayed with its title and a list of tags, where each tag
 * is styled according to its category.
 */
const ArcTagViewer: React.FC<ArcTagViewerProps> = ({ tags, enableDescriptions }) => {

  return (
    <div className="space-y-8">
      {tags.map((arc) => (
        <div key={arc.arc_id} className="border border-gray-600 rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">{arc.arc_title}</h2>
          <div className="flex flex-wrap gap-2">
            {[...arc.tags]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((tag) => (
                <span
                  key={tag.id}
                  title={enableDescriptions ? tagDescriptions[tag.category]?.[tag.name] || "" : undefined}
                  className={`px-2 py-1 text-sm font-medium rounded-full ${(categoryColors[tag.category] || categoryColors.default)} shadow-sm`}
                >
                {tag.name}
                </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArcTagViewer;