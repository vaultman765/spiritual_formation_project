import React from 'react';
import { Link } from 'react-router-dom';
import TagBlock from '@/components/TagBlock';

interface DaySummary {
  master_day_number: number;
  arc_day_number: number;
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
    <div className="px-6 pt-6 w-full">
      <h2 className="text-xl font-bold mb-4">Meditation Day Index</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {days.map((day) => (
          <Link to={`/days/${day.master_day_number}`} key={day.master_day_number} className="!no-underline">
            <div className="p-4 rounded-lg border border-gray-700 hover:bg-slate-800 transition cursor-pointer h-full">
              <p className="font-semibold text-white">
                <span className="mr-2">Day {day.master_day_number}:</span>
                {day.day_title}
              </p>
              <p className="text-sm text-gray-400">Day {day.arc_day_number} of Arc: {day.arc_title}</p>
              <p className="text-sm text-gray-500 mb-2">Arc ID: {day.arc_id}</p>

              <div className="ml-2">
                {day.tags && (
                  <div className="mt-2">
                    <h3 className="font-semibold text-gray-300 text-sm mt-3">Tags</h3>
                    <TagBlock tagsByCategory={day.tags} />
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DayListViewer;
