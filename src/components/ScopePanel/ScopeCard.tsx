'use client';

import { useState, useRef, useEffect } from 'react';
import { Scope, SCOPE_COLORS } from '@/types';

interface ScopeCardProps {
  scope: Scope;
  onDelete: (id: string) => void;
  onUpdateName: (scopeId: string, name: string) => void;
  onUpdateDescription: (scopeId: string, description: string) => void;
  onUpdateColor: (scopeId: string, color: string) => void;
  isDragging: boolean;
  isDragOver: boolean;
  onDragStart: () => void;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}

export default function ScopeCard({
  scope,
  onDelete,
  onUpdateName,
  onUpdateDescription,
  onUpdateColor,
  isDragging,
  isDragOver,
  onDragStart,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onDragEnd,
}: ScopeCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(scope.name);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showColorPicker) return;
    const handleClick = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [showColorPicker]);

  return (
    <div
      className={`flex flex-col gap-0 p-3 border border-border-muted rounded-md bg-bg-default transition-[opacity,border-color] duration-150 ${isDragging ? 'opacity-40' : ''} ${isDragOver ? 'border-fg-accent border-dashed' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-center gap-2">
        <span className="flex items-center text-fg-muted cursor-grab shrink-0 active:cursor-grabbing">
          <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
            <circle cx="3" cy="2" r="1.5" />
            <circle cx="7" cy="2" r="1.5" />
            <circle cx="3" cy="7" r="1.5" />
            <circle cx="7" cy="7" r="1.5" />
            <circle cx="3" cy="12" r="1.5" />
            <circle cx="7" cy="12" r="1.5" />
          </svg>
        </span>
        <div className="relative shrink-0" ref={colorPickerRef}>
          <button
            className="w-3 h-3 rounded-full border-none cursor-pointer p-0 transition-transform duration-100 hover:scale-130"
            style={{ backgroundColor: scope.color }}
            onClick={() => setShowColorPicker(!showColorPicker)}
            aria-label="Change color"
          />
          {showColorPicker && (
            <div className="absolute top-5 -left-1 flex gap-1 p-2 bg-bg-default border border-border-muted rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.12)] z-10">
              {SCOPE_COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-5 h-5 rounded-full border-2 border-transparent cursor-pointer p-0 transition-transform duration-100 hover:scale-120 ${color === scope.color ? 'border-fg-default' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    onUpdateColor(scope.id, color);
                    setShowColorPicker(false);
                  }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          )}
        </div>
        {editingName ? (
          <input
            className="flex-1 text-sm font-medium text-fg-default border border-fg-accent rounded-sm py-0.5 px-1 outline-none shadow-[0_0_0_3px_var(--bg-accent-subtle)]"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={() => {
              const trimmed = nameValue.trim();
              if (trimmed && trimmed !== scope.name) onUpdateName(scope.id, trimmed);
              setEditingName(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
              if (e.key === 'Escape') { setNameValue(scope.name); setEditingName(false); }
            }}
            autoFocus
          />
        ) : (
          <button
            className="flex-1 text-sm font-medium text-fg-default bg-none border-none cursor-pointer text-left p-0 hover:text-fg-accent"
            onClick={() => setExpanded(!expanded)}
            onDoubleClick={() => { setNameValue(scope.name); setEditingName(true); }}
          >
            {scope.name}
          </button>
        )}
        <button
          className="flex items-center justify-center bg-none border-none text-fg-muted cursor-pointer p-1 rounded-sm hover:text-fg-danger hover:bg-bg-danger-subtle"
          onClick={() => onDelete(scope.id)}
          aria-label={`Delete ${scope.name}`}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11 1.75V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM6.5 1.75V3h3V1.75a.25.25 0 00-.25-.25h-2.5a.25.25 0 00-.25.25zM4.997 6.178a.75.75 0 10-1.493.144l.684 7.088A2.25 2.25 0 006.43 15.5h3.14a2.25 2.25 0 002.242-2.09l.684-7.088a.75.75 0 10-1.493-.144l-.684 7.088a.75.75 0 01-.748.734H6.43a.75.75 0 01-.748-.734l-.684-7.088z" />
          </svg>
        </button>
      </div>
      {expanded && (
        <textarea
          className="mt-2 w-full p-2 border border-border-muted rounded-sm font-family-system text-xs leading-relaxed resize-y outline-none text-fg-default focus:border-fg-accent focus:shadow-[0_0_0_3px_var(--bg-accent-subtle)] placeholder:text-fg-muted"
          value={scope.description}
          onChange={(e) => onUpdateDescription(scope.id, e.target.value)}
          placeholder="Add a description..."
          rows={3}
        />
      )}
    </div>
  );
}
