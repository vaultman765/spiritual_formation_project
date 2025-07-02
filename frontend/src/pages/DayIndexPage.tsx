import { useEffect, useState } from "react";
import DayListViewer from "@/components/DayListViewer";

type DaySummary = {
  master_day_number: number;
  arc_id: string;
  arc_day_number: number;
  arc_title: string;
  day_title: string;
  tags: Record<string, string[]>;
};

export default function DayIndexPage() {
  const [days, setDays] = useState<DaySummary[]>([]);

  useEffect(() => {
    fetch("/api/days/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched day data:", data); 
        setDays(data as DaySummary[]);
      })
      .catch((error) => console.error("Error fetching days:", error));
  }, []);

  return (
    <div className="w-full h-full px-6 pt-6">
      <h1 className="text-3xl font-bold mb-4">All Meditation Days</h1>
      <DayListViewer days={days} />
    </div>

  );
}
