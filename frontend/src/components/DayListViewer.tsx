import React from 'react';

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

const categoryColors: { [key: string]: string } = {
  doctrinal: 'bg-blue-200 text-blue-800',
  liturgical: 'bg-green-200 text-green-800',
  mystical: 'bg-purple-200 text-purple-800',
  thematic: 'bg-yellow-200 text-yellow-800',
  typological: 'bg-pink-200 text-pink-800',
  virtue: 'bg-red-200 text-red-800',
  structural: 'bg-gray-200 text-gray-800',
};

const DayListViewer: React.FC<Props> = ({ days }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Meditation Day Index</h2>
      <ul>
        {days.map((day) => (
          <li key={day.master_day_number} className="mb-8">
            <p className="font-semibold">
              <span className="mr-2">Day {day.master_day_number}: </span>
              {day.day_title}
            </p>
            <p className="text-sm text-gray-600">Arc: {day.arc_title}</p>
            <p className="text-sm text-gray-500 mb-2">Arc ID: {day.arc_id}</p>
            <p className="font-medium">Tags:</p>
            <div className="ml-4 space-y-2">
              {day.tags && (
                <div className="mt-2">
                  <h4 className="font-semibold text-lg mt-3">Tags:</h4>
                    <ul className="space-y-2 mt-2">
                      {Object.entries(day.tags).map(([category, tagList]) => (
                        <li key={category} className="mb-4">
                          <span
                            className={`inline-block px-2 py-1 rounded font-medium text-sm ${categoryColors[category] || 'bg-gray-100 text-gray-800'}`}
                          >
                            {category}
                          </span>
                          <ul className="ml-4 list-disc list-inside">
                            {tagList.map((tag, index) => (
                              <li key={index} className="text-slate-200">{tag}</li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DayListViewer;
