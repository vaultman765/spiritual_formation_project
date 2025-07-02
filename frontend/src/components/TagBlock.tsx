import React from "react";
import tagDescriptions from "@/utils/tagDescriptions";
import { categoryColors, defaultCategoryOrder } from "@/utils/constants";

interface TagBlockProps {
  tagsByCategory: {
    [category: string]: string[];
  };
  categoryOrder?: string[];
  enableDescriptions?: boolean;
}

const TagBlock: React.FC<TagBlockProps> = ({
  tagsByCategory,
  categoryOrder = defaultCategoryOrder,
  enableDescriptions = true,
}) => {
  return (
    <div className="space-y-4">
      {categoryOrder.map((category) => {
        const tags = tagsByCategory[category];
        if (!tags) return null;

        const sortedTags = [...tags].sort();
        const categoryClass = categoryColors[category] || categoryColors.default;

        return (
          <div key={category}>
            <p className="text-sm text-gray-300 font-medium capitalize mb-1">{category}</p>
            <div className="flex flex-wrap gap-2">
              {sortedTags.map((tag, i) => {
                const tagDesc =
                  enableDescriptions && tagDescriptions[category]?.[tag]
                    ? tagDescriptions[category][tag]
                    : undefined;

                return (
                  <span
                    key={i}
                    title={tagDesc}
                    className={`text-xs px-2 py-1 rounded-full shadow-sm ${categoryClass}`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TagBlock;
 