import React from 'react';
import { Link } from 'react-router-dom';
import { categoryColors } from '@/utils/constants';

interface DaySummary {
  master_day_number: number;
  arc_id: string;
  arc_title: string;
  day_title: string;
  tags: {
    [category: string]: string[];
  };
}

interface Props {
  days: DaySummary[];
}

const DayListViewer: React.FC<Props> = ({ days }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Meditation Day Index</h2>
      <ul>
        {days.map((day) => (
          <Link to={`/days/${day.master_day_number}`} key={day.master_day_number}>
            <li className="mb-8 p-4 rounded-lg border border-gray-700 hover:bg-slate-800 transition cursor-pointer">
              <p className="font-semibold text-white">
                <span className="mr-2">Day {day.master_day_number}:</span>
                {day.day_title}
              </p>
              <p className="text-sm text-gray-400">Arc: {day.arc_title}</p>
              <p className="text-sm text-gray-500 mb-2">Arc ID: {day.arc_id}</p>

              <div className="ml-4 space-y-2">
                {day.tags && (
                  <div className="mt-2">
                    <h4 className="font-semibold text-gray-300 text-sm mt-3">Tags:</h4>
                    <ul className="space-y-2 mt-2">
                      {Object.entries(day.tags).map(([category, tags]) => {
                        const sortedTags = [...tags].sort();
                        const categoryClass = categoryColors[category] || categoryColors.default;

                        return (
                          <div key={category}>
                            <h3 className="text-sm text-gray-300 font-medium capitalize mb-1">{category}</h3>
                            <div className="flex flex-wrap gap-2">
                              {sortedTags.map((tag, i) => (
                                <span
                                  key={i}
                                  className={`text-xs px-2 py-1 rounded-full shadow-sm ${categoryClass}`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default DayListViewer;
