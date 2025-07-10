export async function fetchAllArcs() {
  const res = await fetch("/api/arcs/");
  if (!res.ok) throw new Error("Failed to fetch arcs");
  return await res.json();
}

export async function fetchArcById(arcId: string) {
  const response = await fetch(`/api/arcs/${arcId}`);
  if (!response.ok) throw new Error("Failed to fetch arc");
  return response.json();
}