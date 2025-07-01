import React, { useState } from "react";

interface ArcTagFilterBarProps {
  onFilter: (filters: {
    search: string;
    category: string;
  }) => void;
}

const ArcTagFilterBar: React.FC<ArcTagFilterBarProps> = ({ onFilter }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = (e.target as HTMLInputElement).value;
  setSearch(value);
  onFilter({ search: value, category });
};

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const value = (e.target as HTMLSelectElement).value;
  setCategory(value);
  onFilter({ search, category: value });
};

  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      <input
        type="text"
        placeholder="Search tags or arcs..."
        value={search}
        onChange={handleSearchChange}
        className="px-3 py-2 rounded-md border border-gray-600 bg-black text-white placeholder-gray-400 w-full md:w-1/2"
      />
      <select
        value={category}
        onChange={handleCategoryChange}
        className="px-3 py-2 rounded-md border border-gray-600 bg-black text-white w-full md:w-1/4"
      >
        <option value="">All Categories</option>
        <option value="thematic">Thematic</option>
        <option value="doctrinal">Doctrinal</option>
        <option value="virtue">Virtue</option>
        <option value="mystical">Mystical</option>
        <option value="liturgical">Liturgical</option>
        <option value="typological">Typological</option>
        <option value="structural">Structural</option>
      </select>
    </div>
  );
};

export default ArcTagFilterBar;
