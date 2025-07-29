import axios from 'axios';
import { getCSRFToken } from '@/utils/auth/tokens';
import type { NoteInput, MeditationNote } from '@/utils/types';

const csrfToken = getCSRFToken();

const headers = {
    'X-CSRFToken': csrfToken || '',
    'Content-Type': 'application/json',
  };

export const getNote = async (dayId: number): Promise<MeditationNote> => {
  const res = await axios.get<MeditationNote[]>(`/api/notes/?day=${dayId}`);
  return res.data[0];
};

export const saveNote = async (note: NoteInput): Promise<MeditationNote> => {
  let method: 'post' | 'put';
  let url: string;

  if (!note.id || note.id <= 0 || note.id === undefined) {
    method = 'post';
    url = '/api/notes/';
  } else {
    method = 'put';
    url = `/api/notes/${note.id}/`;
  }

  const res = await axios({
    method,
    url,
    headers,
    data: {
      meditation_day: note.meditation_day,
      content: note.content,
    },
  });
  
  const data = res.data as unknown as MeditationNote;
  return data; 
};

export const deleteNote = async (dayId: number): Promise<void> => {
  await axios.delete(`/api/notes/by-day/`, {
    params: { day: dayId },
    headers: {
      'X-CSRFToken': csrfToken || '',
    },
  });
};


export async function getAllNotes(): Promise<MeditationNote[]> {
  const res = await axios.get<MeditationNote[]>('/api/notes/');
  return res.data;
}

