import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import TagBlock from "@/components/TagBlock";
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
      <div className="flex justify-center items-center">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center mt-10">{error}</div>;
  }

  if (!dayData) return null;

  return (
  <div className="w-screen overflow-x-hidden">
    <div className="w-full max-w-5xl mx-auto min-h-screen px-4 py-10 space-y-6">
      {/* Header */}
      <div className="space-y-2 mb-4">
        <h1>{dayData.day_title}</h1>
        <p className="!text-sm italic">
          Day {dayData.arc_day_number} of <span className="not-italic">{dayData.arc_title}</span>
        </p>
      </div>

      {/* Nav Links */}
      <div className="flex justify-between items-center pt-6 border-t border-border mt-8">
        {dayData.master_day_number > 1 ? (
          <Link
            to={`/days/${dayData.master_day_number - 1}`}
            className="text-sm text-blue-500 hover:text-blue-600 underline transition"
          >
            ← Previous Day
          </Link>
        ) : <div />}

        <Link
          to={`/days/${dayData.master_day_number + 1}`}
          className="text-sm text-blue-500 hover:text-blue-600 underline transition"
        >
          Next Day →
        </Link>
      </div>

      {/* Anchor Image */}
      {dayData.anchor_image && (
        <Card>
          <CardContent className="">
            <h2>Anchor Image</h2>
            <p className="italic">{dayData.anchor_image}</p>
          </CardContent>
        </Card>
      )}

      {/* Primary Reading */}
      <Card>
        <CardContent>
          <h2>Primary Reading</h2>
          <p>
            {dayData.primary_reading.title}
            {dayData.primary_reading.reference && ` — ${dayData.primary_reading.reference}`}
            {dayData.primary_reading.url && (
              <> (<a href={dayData.primary_reading.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600 underline">source</a>)</>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Secondary Readings */}
      {dayData.secondary_readings.length > 0 && (
        <Card>
          <CardContent>
            <h2>Secondary Readings</h2>
            <ul className="list-disc">
              {dayData.secondary_readings.map((sr, i) => (
                <p>
                  <li key={i}>
                    {sr.title}
                    {sr.reference && ` — ${sr.reference}`}
                    {sr.url && (
                        <> (<a href={sr.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600 underline">source</a>)</>
                      )}
                  </li>
                </p>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Meditative Points */}
      <Card>
        <CardContent>
          <h2>Meditative Points</h2>
          <ul className="list-disc">
            {dayData.meditative_points.map((point, i) => (
              <p>
                <li key={i}>{point}</li>
              </p>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Final Prayers */}
      <Card>
        <CardContent className="space-y-6">
          <div>
            <h2>Ejaculatory Prayer</h2>
            <p>{dayData.ejaculatory_prayer}</p>
          </div>
          <div>
            <h2>Colloquy</h2>
            <p>{dayData.colloquy}</p>
          </div>
          <div>
            <h2>Resolution</h2>
            <p>{dayData.resolution}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {dayData.tags && (
        <Card className="bg-slate-800/60 border border-slate-600">
          <CardContent>
            <h2>Tags</h2>
            <TagBlock tagsByCategory={dayData.tags} />
          </CardContent>
        </Card>
      )}

      {/* Nav Links */}
      <div className="flex justify-between items-center pt-6 border-t border-border mt-8">
        {dayData.master_day_number > 1 ? (
          <Link
            to={`/days/${dayData.master_day_number - 1}`}
            className="text-sm text-blue-500 hover:text-blue-600 underline transition"
          >
            ← Previous Day
          </Link>
        ) : <div />}

        <Link
          to={`/days/${dayData.master_day_number + 1}`}
          className="text-sm text-blue-500 hover:text-blue-600 underline transition"
        >
          Next Day →
        </Link>
      </div>
    </div>
  </div>
);
};

export default DayDetailPage;
