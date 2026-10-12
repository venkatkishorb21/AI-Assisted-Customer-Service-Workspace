import React, { useState } from 'react';
import { InternalNote } from '../../types';
import { StickyNote, Plus, Pin, Trash2, Clock } from 'lucide-react';

interface InternalNotesViewProps {
  notes: InternalNote[];
  onAddNote: (text: string, isPinned: boolean) => void;
  onDeleteNote: (noteId: string) => void;
}

export const InternalNotesView: React.FC<InternalNotesViewProps> = ({
  notes,
  onAddNote,
  onDeleteNote
}) => {
  const [noteText, setNoteText] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    onAddNote(noteText, isPinned);
    setNoteText('');
    setIsPinned(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <StickyNote className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Internal Staff Notes</h3>
            <p className="text-[11px] text-slate-500">Private notes visible only to call-centre staff</p>
          </div>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
          {notes.length} Notes
        </span>
      </div>

      {/* Note Creator */}
      <form onSubmit={handleSubmit} className="space-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <textarea
          rows={2}
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          placeholder="Add an internal observation, diagnostic step, or handover note..."
          className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
        />

        <div className="flex items-center justify-between gap-2">
          <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={e => setIsPinned(e.target.checked)}
              className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <Pin className={`w-3 h-3 ${isPinned ? 'text-amber-600 fill-amber-600' : 'text-slate-400'}`} />
            <span className="text-[11px] font-medium">Pin to top of case</span>
          </label>

          <button
            type="submit"
            disabled={!noteText.trim()}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Save Note</span>
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
        {notes.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4 italic">
            No internal notes recorded yet for this case.
          </p>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className={`p-3 rounded-xl border text-xs space-y-1.5 transition ${
                note.isPinned 
                  ? 'bg-amber-50/60 border-amber-200 text-amber-950' 
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {note.isPinned && <Pin className="w-3 h-3 text-amber-600 fill-amber-600 shrink-0" />}
                  <span className="font-bold text-slate-900">{note.author}</span>
                  <span className="text-[10px] text-slate-400 font-medium">({note.authorRole})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {note.timestamp}
                  </span>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="text-slate-400 hover:text-rose-600 transition"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">{note.text}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
