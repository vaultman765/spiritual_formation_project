import axios from '@/utils/axios';
import type { MeditationNote } from '@/utils/types';

const API_URL = import.meta.env.VITE_API_URL;

export async function getAllNotes(): Promise<MeditationNote[]> {
  const res = await axios.get<MeditationNote[]>(`${API_URL}/api/notes/`);
  return res.data;
}