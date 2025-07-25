export async function fetchDayByArc(arcID: string, arcDayNumber: number) {
  const res = await fetch(`/api/days/?arc_id=${arcID}&arc_day_number=${arcDayNumber}`);
  if (!res.ok) throw new Error("Failed to fetch day");
  return await res.json();
}

export async function fetchDaysByArcId(arcId: string) {
  const response = await fetch(`/api/days/?arc_id=${arcId}`);
  if (!response.ok) throw new Error("Failed to fetch days for arc");
  return response.json();
}
