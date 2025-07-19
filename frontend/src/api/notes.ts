import axios from '@/utils/axios';
import type { MeditationNote } from '@/utils/types';

export async function getAllNotes(): Promise<MeditationNote[]> {
  const res = await axios.get<MeditationNote[]>('/api/notes/');
  return res.data;
}