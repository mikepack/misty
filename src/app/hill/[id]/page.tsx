'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useHills } from '@/context/HillsContext';
import { usePresence } from '@/lib/usePresence';
import HillDescription from '@/components/HillDescription/HillDescription';
import ScopePanel from '@/components/ScopePanel/ScopePanel';
import HillChart from '@/components/HillChart/HillChart';

export default function HillPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    getHill,
    updateHill,
    addScope,
    deleteScope,
    updateScopePosition,
    commitScopePosition,
    updateScopeName,
    updateScopeDescription,
    updateScopeColor,
    reorderScopes,
  } = useHills();

  const hill = getHill(id);
  const presenceUsers = usePresence(id);

  const handleTitleChange = useCallback(
    (title: string) => updateHill(id, { title }),
    [id, updateHill]
  );

  const handleDescriptionChange = useCallback(
    (description: string) => updateHill(id, { description }),
    [id, updateHill]
  );

  const handleAddScope = useCallback(
    (name: string) => addScope(id, name),
    [id, addScope]
  );

  const handleDeleteScope = useCallback(
    (scopeId: string) => deleteScope(id, scopeId),
    [id, deleteScope]
  );

  const handleUpdatePosition = useCallback(
    (scopeId: string, position: number) => updateScopePosition(id, scopeId, position),
    [id, updateScopePosition]
  );

  const handleCommitPosition = useCallback(
    (scopeId: string, oldPos: number, newPos: number) => commitScopePosition(id, scopeId, oldPos, newPos),
    [id, commitScopePosition]
  );

  const handleUpdateScopeName = useCallback(
    (scopeId: string, name: string) => updateScopeName(id, scopeId, name),
    [id, updateScopeName]
  );

  const handleUpdateScopeDescription = useCallback(
    (scopeId: string, description: string) => updateScopeDescription(id, scopeId, description),
    [id, updateScopeDescription]
  );

  const handleUpdateScopeColor = useCallback(
    (scopeId: string, color: string) => updateScopeColor(id, scopeId, color),
    [id, updateScopeColor]
  );

  const handleReorder = useCallback(
    (fromIndex: number, toIndex: number) => reorderScopes(id, fromIndex, toIndex),
    [id, reorderScopes]
  );

  if (!hill) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <p>Hill not found.</p>
        <button onClick={() => router.push('/')} style={{ marginTop: 16, cursor: 'pointer' }}>
          Back to hills
        </button>
      </div>
    );
  }

  return (
    <div className="layout">
      <div className="leftPanel">
        <button
          onClick={() => router.push('/')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--fg-muted)',
            cursor: 'pointer',
            fontSize: 12,
            marginBottom: 16,
            padding: 0,
          }}
        >
          &larr; All hills
        </button>
        <HillDescription
          title={hill.title}
          onTitleChange={handleTitleChange}
          description={hill.description}
          onDescriptionChange={handleDescriptionChange}
          presenceUsers={presenceUsers}
        />
        <ScopePanel
          scopes={hill.scopes}
          onAddScope={handleAddScope}
          onDeleteScope={handleDeleteScope}
          onReorder={handleReorder}
          onUpdateName={handleUpdateScopeName}
          onUpdateDescription={handleUpdateScopeDescription}
          onUpdateColor={handleUpdateScopeColor}
        />
      </div>
      <div className="rightPanel">
        <HillChart scopes={hill.scopes} onUpdatePosition={handleUpdatePosition} onCommitPosition={handleCommitPosition} />
      </div>
    </div>
  );
}
