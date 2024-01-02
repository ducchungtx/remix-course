import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import NewNote, { links as newNoteLinks } from '~/components/NewNote';
import NoteList, {
  links as noteListLinks,
} from '~/components/NoteList';
import { getStoredNotes, storeNotes } from '~/data/notes';
import Note from '~/models/Note';

export default function NotesPage() {
  const notes = useLoaderData<Array<Note>>();
  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export const loader = async () => {
  const notes = await getStoredNotes();
  return notes;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);

  if (noteData.title.trim().length < 5) {
    return { message: 'Invalid title - must be at least 5 characters long.' };
  }

  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updateNotes = existingNotes.concat(noteData);
  await storeNotes(updateNotes);
  // await new Promise<void>((resolve) => setTimeout(() => resolve(), 2000));
  return redirect('/notes');
};

export const links = () => {
  return [...newNoteLinks(), ...noteListLinks()];
};
