import {
  ActionFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from '@remix-run/node';
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';

import NewNote, { links as newNoteLinks } from '~/components/NewNote';
import NoteList, { links as noteListLinks } from '~/components/NoteList';
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
  if (!notes || notes.length === 0) {
    throw json({ message: 'No notes found' }, { status: 404 });
  }
  return notes;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);

  if (String(noteData.title).trim().length < 5) {
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

export const meta: MetaFunction = () => {
  return [{ title: 'Notes' }, { description: 'A list of notes' }];
};
