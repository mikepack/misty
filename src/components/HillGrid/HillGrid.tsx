'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Hill } from '@/types';
import { positionToPoint, generateHillPath } from '@/components/HillChart/hillMath';
import { useAllPresence, PresenceUser } from '@/lib/usePresence';
import { AnimalAvatar } from '@/lib/animalAvatars';

const miniPath = generateHillPath();

interface HillGridProps {
  hills: Hill[];
  onAddHill: (title: string) => string;
  onDeleteHill: (id: string) => void;
  onDuplicateHill: (id: string) => string;
  onReorderHills: (fromIndex: number, toIndex: number) => void;
}

function MiniHillChart({ hill }: { hill: Hill }) {
  return (
    <svg viewBox="0 0 800 300" className="w-full h-auto mt-3 block" preserveAspectRatio="xMidYMid meet">
      <path d={miniPath} fill="none" stroke="var(--border-default)" strokeWidth={2} />
      {hill.scopes.map((scope) => {
        const { x, y } = positionToPoint(scope.position);
        return (
          <circle key={scope.id} cx={x} cy={y} r={10} fill={scope.color} stroke="var(--bg-default)" strokeWidth={2} />
        );
      })}
    </svg>
  );
}

export default function HillGrid({ hills, onAddHill, onDeleteHill, onDuplicateHill, onReorderHills }: HillGridProps) {
  const router = useRouter();
  const presenceMap = useAllPresence();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Hill | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null);
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const handleSubmit = () => {
    const trimmed = newTitle.trim();
    if (trimmed) {
      const id = onAddHill(trimmed);
      setNewTitle('');
      setIsAdding(false);
      router.push(`/hill/${id}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    else if (e.key === 'Escape') { setNewTitle(''); setIsAdding(false); }
  };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDragEnter = (index: number) => setOverIndex(index);
  const handleDrop = (index: number) => {
    if (dragIndex !== null && dragIndex !== index) onReorderHills(dragIndex, index);
    setDragIndex(null);
    setOverIndex(null);
  };
  const handleDragEnd = () => { setDragIndex(null); setOverIndex(null); };

  return (
    <div className="max-w-[960px] mx-auto py-12 px-6">
      <h1 className="text-[32px] font-semibold text-fg-default mb-6">Hills</h1>
      <div className="grid grid-cols-2 max-sm:grid-cols-1 auto-rows-fr gap-4">
        {hills.map((hill, index) => (
          <div
            key={hill.id}
            className={`p-5 bg-bg-default border border-border-muted rounded-md cursor-pointer transition-[border-color,box-shadow,opacity] duration-150 hover:border-fg-accent hover:shadow-[0_1px_3px_var(--bg-accent-subtle)] ${dragIndex === index ? 'opacity-40' : ''} ${overIndex === index && dragIndex !== index ? 'border-fg-accent border-dashed' : ''}`}
            onClick={() => router.push(`/hill/${hill.id}`)}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDragEnter={() => handleDragEnter(index)}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-base font-semibold text-fg-default m-0">{hill.title || 'Untitled hill'}</h2>
              <div className="relative shrink-0" ref={menuOpen === hill.id ? menuRef : undefined}>
                <button
                  className="flex items-center justify-center bg-none border-none text-fg-muted cursor-pointer p-1 rounded-sm hover:text-fg-default hover:bg-bg-muted"
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === hill.id ? null : hill.id); }}
                  aria-label="Hill options"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="8" cy="3" r="1.5" />
                    <circle cx="8" cy="8" r="1.5" />
                    <circle cx="8" cy="13" r="1.5" />
                  </svg>
                </button>
                {menuOpen === hill.id && (
                  <div className="absolute top-7 right-0 bg-bg-default border border-border-muted rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.12)] z-20 min-w-[120px] overflow-hidden">
                    <button
                      className="block w-full py-2 px-3 bg-none border-none text-[13px] text-fg-default cursor-pointer text-left hover:bg-bg-muted"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateHill(hill.id);
                        setMenuOpen(null);
                      }}
                    >
                      Duplicate
                    </button>
                    <button
                      className="block w-full py-2 px-3 bg-none border-none text-[13px] text-fg-danger cursor-pointer text-left hover:bg-bg-danger-subtle"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(null);
                        setDeleteTarget(hill);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            <MiniHillChart hill={hill} />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-fg-muted">
                {hill.scopes.length} {hill.scopes.length === 1 ? 'scope' : 'scopes'}
              </span>
              {presenceMap[hill.id] && presenceMap[hill.id].length > 0 && (
                <div className="flex gap-0.5">
                  {presenceMap[hill.id].map((user) => (
                    <div
                      key={user.id}
                      className="w-6 h-6 rounded-full overflow-hidden bg-bg-muted border border-border-muted"
                      style={{ color: user.color }}
                      title={user.name}
                    >
                      <AnimalAvatar animal={user.animal} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isAdding ? (
          <div className="p-5 bg-bg-default border-2 border-fg-accent rounded-md flex flex-col gap-3 justify-center items-center min-h-[180px]">
            <input
              type="text"
              className="py-2 px-3 border border-border-muted rounded-md text-sm outline-none w-full max-w-[300px] text-fg-default focus:border-fg-accent focus:shadow-[0_0_0_3px_var(--bg-accent-subtle)]"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Hill title..."
              autoFocus
            />
            <div className="flex gap-2 justify-center w-full max-w-[300px]">
              <button className="py-2 px-4 bg-bg-success-emphasis text-fg-on-emphasis border-none rounded-md text-sm font-medium cursor-pointer hover:opacity-90" onClick={handleSubmit}>
                Create
              </button>
              <button
                className="py-2 px-3 bg-none border border-border-muted rounded-md text-sm text-fg-muted cursor-pointer hover:bg-bg-muted"
                onClick={() => { setNewTitle(''); setIsAdding(false); }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button className="flex flex-col items-center justify-center gap-2 p-5 bg-bg-default border-2 border-dashed border-border-default rounded-md cursor-pointer text-fg-muted text-sm min-h-[180px] transition-[border-color,color] duration-150 hover:border-fg-accent hover:text-fg-accent" onClick={() => setIsAdding(true)}>
            <span className="text-[28px] font-light leading-none">+</span>
            <span>New hill</span>
          </button>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100" onClick={() => setDeleteTarget(null)}>
          <div className="bg-bg-default border border-border-muted rounded-lg p-6 w-[360px] shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm text-fg-default mb-5 leading-relaxed">
              Delete <strong>{deleteTarget.title || 'Untitled hill'}</strong>? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="py-2 px-3 bg-none border border-border-muted rounded-md text-sm text-fg-muted cursor-pointer hover:bg-bg-muted"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                className="py-2 px-4 bg-fg-danger text-fg-on-emphasis border-none rounded-md text-sm font-medium cursor-pointer hover:opacity-90"
                onClick={() => {
                  onDeleteHill(deleteTarget.id);
                  setDeleteTarget(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
