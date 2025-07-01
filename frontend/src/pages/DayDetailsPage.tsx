import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Loader2 } from 'lucide-react';

interface Reading {
  title: string;
  reference?: string;
  url?: string;
}

interface DayData {
  master_day_number: number;
  arc_id: string;
  arc_day_number: number;
  arc_title: string;
  day_title: string;
  anchor_image: string;
  primary_reading: Reading;
  secondary_readings: Reading[];
  meditative_points: string[];
  ejaculatory_prayer: string;
  colloquy: string;
  resolution: string;
  tags: {
    [category: string]: string[];
  };
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

const DayDetailPage: React.FC = () => {
  const { dayNumber } = useParams();
  const [dayData, setDayData] = useState<DayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDayData = async () => {
      try {
        const response = await fetch(`/api/days/${dayNumber}/`);
        if (!response.ok) {
          throw new Error(`Error fetching day: ${response.status}`);
        }
        const data = (await response.json()) as DayData;
        setDayData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDayData();
  }, [dayNumber]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center mt-10">{error}</div>;
  }

  if (!dayData) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">

      <div className="space-y-1">
        <h1 className="text-4xl font-bold text-white mb-2">{dayData.day_title}</h1>
        <p className="text-sm text-gray-400 italic mb-6">
          Day {dayData.arc_day_number} of <span className="not-italic font-medium">{dayData.arc_title}</span>
        </p>
      </div>

      {dayData.anchor_image && (
        <Card className="bg-slate-800/60 border border-slate-600">
          <CardContent className="p-4 text-sm text-gray-200 italic">
            <strong className="block text-gray-300 mb-1">Anchor Image</strong>
            {dayData.anchor_image}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold text-white mb-2">Primary Reading</h2>
          <p className="text-gray-200">
            <strong>{dayData.primary_reading.title}</strong>
            {dayData.primary_reading.reference && ` — ${dayData.primary_reading.reference}`}
            {dayData.primary_reading.url && (
              <> (<a href={dayData.primary_reading.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors underline">source</a>)</>
            )}
          </p>
        </CardContent>
      </Card>

      {dayData.secondary_readings.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold text-white mb-2">Secondary Readings</h2>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              {dayData.secondary_readings.map((sr, i) => (
                <li key={i}>
                  <strong>{sr.title}</strong>
                  {sr.reference && ` — ${sr.reference}`}
                  {sr.url && (
                    <> (<a href={sr.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors underline">source</a>)</>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold text-white mb-2">Meditative Points</h2>
          <ul className="list-decimal list-inside space-y-1 text-gray-200">
            {dayData.meditative_points.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-gray-200 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Ejaculatory Prayer</h2>
            <p>{dayData.ejaculatory_prayer}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Colloquy</h2>
            <p>{dayData.colloquy}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Resolution</h2>
            <p>{dayData.resolution}</p>
          </div>
        </CardContent>
      </Card>

      {dayData.tags && (
        <Card className="bg-slate-800/60 border border-slate-600">
          <CardContent>
            <h2 className="text-xl font-semibold text-white mb-4">Tags</h2>
            <div className="space-y-4">
              {Object.entries(dayData.tags).map(([category, tags]) => {
                const sortedTags = [...tags].sort();
                const categoryClass = categoryColors[category] || categoryColors.fallback;

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
            </div>
          </CardContent>
        </Card>
      )}
      <div className="flex justify-between items-center pt-6 border-t border-gray-700 mt-8">
        {dayData.master_day_number > 1 ? (
          <Link
            to={`/days/${dayData.master_day_number - 1}`}
            className="text-sm text-blue-400 hover:text-blue-300 underline transition"
          >
            ← Previous Day
          </Link>
        ) : <div />}

        <Link
          to={`/days/${dayData.master_day_number + 1}`}
          className="text-sm text-blue-400 hover:text-blue-300 underline transition"
        >
          Next Day →
        </Link>
      </div>
    </div>
  );
};

export default DayDetailPage;
