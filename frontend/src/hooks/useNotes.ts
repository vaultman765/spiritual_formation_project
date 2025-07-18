import axios from 'axios';
import { getCSRFToken } from '@/utils/auth/tokens';
import type { NoteInput, NoteResponse } from '@/utils/types';

const csrfToken = getCSRFToken();

const headers = {
    'X-CSRFToken': csrfToken || '',
    'Content-Type': 'application/json',
  };

export const getNote = async (dayId: number): Promise<NoteResponse> => {
  const res = await axios.get<NoteResponse[]>(`/api/notes/?day=${dayId}`);
  console.log(`Fetched note for day ${dayId}:`, res.data);
  console.log('res.data.id:', res.data[0]?.id);
  return res.data[0];
};

export const saveNote = async (note: NoteInput): Promise<NoteResponse> => {
  let method: 'post' | 'put';
  let url: string;

  if (!note.id || note.id <= 0 || note.id === undefined) {
    method = 'post';
    url = '/api/notes/';
  } else {
    method = 'put';
    url = `/api/notes/${note.id}/`;
  }
  console.log(`Saving note with method: ${method}, URL: ${url}`, note);
  const res = await axios({
    method,
    url,
    headers,
    data: {
      meditation_day: note.meditation_day,
      content: note.content,
    },
  });

  const data = res.data as NoteResponse;
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
