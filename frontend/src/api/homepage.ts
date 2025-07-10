export async function fetchTodayMeditation() {
  const res = await fetch("/api/days/homepage/today/");
  if (!res.ok) throw new Error("Failed to fetch today’s meditation");
  return await res.json();
}

export async function fetchTomorrowMeditation() {
  const res = await fetch("/api/days/homepage/tomorrow/");
  if (!res.ok) throw new Error("Failed to fetch tomorrow’s meditation");
  return await res.json();
}
