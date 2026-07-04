"use client";

import { createNote, deleteNote } from "@/app/admin/actions";

interface NoteData {
  id: string;
  content: string;
  author: string | null;
  createdAt: Date;
}

interface Props {
  characterId: string;
  notes: NoteData[];
}

export function NotesList({ characterId, notes }: Props) {
  return (
    <div className="border border-gray-800 rounded-lg p-6 mt-6">
      <h2 className="font-mono text-xs text-gray-500 tracking-widest mb-4">
        ЗАМЕТКИ ({notes.length})
      </h2>

      {notes.length > 0 && (
        <div className="space-y-3 mb-6">
          {notes.map((note) => (
            <div key={note.id} className="border border-gray-800 rounded p-3 group">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-gray-300 whitespace-pre-wrap flex-1">{note.content}</p>
                <button
                  onClick={async () => {
                    if (confirm("Удалить заметку?")) {
                      await deleteNote(note.id, characterId);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 text-red-400/60 hover:text-red-400 text-xs font-mono transition-opacity shrink-0"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-3 mt-2 font-mono text-[10px] text-gray-600">
                {note.author && <span>— {note.author}</span>}
                <span>{new Date(note.createdAt).toLocaleString("ru-RU")}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <form action={createNote} className="space-y-3">
        <input type="hidden" name="characterId" value={characterId} />
        <textarea
          name="content"
          required
          rows={3}
          placeholder="Текст заметки..."
          className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200 placeholder-gray-700 focus:outline-none focus:border-emerald-400 transition-colors resize-y"
        />
        <div className="flex items-center gap-3">
          <input
            type="text"
            name="author"
            placeholder="Автор (необязательно)"
            className="bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200 placeholder-gray-700 focus:outline-none focus:border-emerald-400 transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-amber-400/10 text-amber-400 rounded font-mono text-xs hover:bg-amber-400/20 transition-colors"
          >
            ДОБАВИТЬ ЗАМЕТКУ
          </button>
        </div>
      </form>
    </div>
  );
}
