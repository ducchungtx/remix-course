import { Link, json, useLoaderData } from '@remix-run/react';
import { getStoredNotes } from '~/data/notes';
import Note from '~/models/Note';

import styles from '~/styles/note-details.css';

export default function NoteDetailsPage() {
  const note: Note = useLoaderData();
  return (
    <main id="note-details">
      <nav>
        <Link to="/notes">Back to all Notes</Link>
      </nav>
      <h1>{note.title}</h1>
      <p id="note-details-content">{note.content}</p>
    </main>
  );
}

export const loader = async ({ params }: any) => {
  const notes = await getStoredNotes();
  const noteId = params.noteId;
  const selectedNote = notes.find((note: any) => note.id === params.noteId);

  if (!selectedNote) {
    throw json({ message: `Note not found ${noteId}` }, { status: 404 });
  }

  return selectedNote;
};

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}
