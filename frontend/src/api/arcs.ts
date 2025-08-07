const API_URL = import.meta.env.VITE_API_URL;

export async function fetchAllArcs() {
  const res = await fetch(`${API_URL}/api/arcs/`);
  if (!res.ok) throw new Error("Failed to fetch arcs");
  return await res.json();
}

export async function fetchArcById(arcId: string) {
  const response = await fetch(`${API_URL}/api/arcs/${arcId}/`);
  if (!response.ok) throw new Error("Failed to fetch arc");
  return response.json();
}