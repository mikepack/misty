'use client';

import { useState } from 'react';
import { PresenceUser } from '@/lib/usePresence';
import { AnimalAvatar } from '@/lib/animalAvatars';
import { getIdentity } from '@/lib/identity';

interface HillDescriptionProps {
  title: string;
  onTitleChange: (title: string) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  presenceUsers?: PresenceUser[];
}

export default function HillDescription({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  presenceUsers = [],
}: HillDescriptionProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(title);
  const myId = typeof window !== 'undefined' ? getIdentity().id : '';

  return (
    <div className="mb-6">
      {editingTitle ? (
        <input
          type="text"
          className="block w-full text-[32px] font-semibold border border-fg-accent rounded-sm outline-none px-1 py-1 mb-3 bg-transparent text-fg-default shadow-[0_0_0_3px_var(--bg-accent-subtle)] placeholder:text-fg-muted"
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
          onBlur={() => {
            const trimmed = titleValue.trim();
            if (trimmed && trimmed !== title) onTitleChange(trimmed);
            setEditingTitle(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            if (e.key === 'Escape') { setTitleValue(title); setEditingTitle(false); }
          }}
          placeholder="Hill title..."
          autoFocus
        />
      ) : (
        <h1
          className="text-[32px] font-semibold py-1 mb-3 text-fg-default cursor-default"
          onDoubleClick={() => { setTitleValue(title); setEditingTitle(true); }}
        >
          {title || 'Untitled hill'}
        </h1>
      )}
      {presenceUsers.length > 0 && (
        <div className="flex gap-1 mb-3 flex-wrap">
          {presenceUsers.map((user) => (
            <div key={user.id} className="relative shrink-0 group">
              <div
                className="w-8 h-8 rounded-full overflow-hidden cursor-default bg-bg-muted border-2 border-border-muted"
                style={{ color: user.color }}
              >
                <AnimalAvatar animal={user.animal} />
              </div>
              <span
                className="hidden group-hover:block absolute top-[36px] left-1/2 -translate-x-1/2 text-[11px] font-semibold whitespace-nowrap px-2 py-1 bg-bg-default border border-border-muted rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.12)] z-10 pointer-events-none"
                style={{ color: user.color }}
              >
                {user.name}{user.id === myId ? ' (you)' : ''}
              </span>
            </div>
          ))}
        </div>
      )}
      <textarea
        className="block w-full p-3 border border-border-muted rounded-md font-family-system text-sm leading-relaxed resize-y outline-none text-fg-default focus:border-fg-accent focus:shadow-[0_0_0_3px_var(--bg-accent-subtle)] placeholder:text-fg-muted"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Describe your hill..."
        rows={6}
      />
    </div>
  );
}
