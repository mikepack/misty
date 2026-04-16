'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Scope } from '@/types';
import {
  SVG_WIDTH,
  SVG_HEIGHT,
  PADDING,
  CHART_WIDTH,
  positionToPoint,
  generateHillPath,
  svgXToPosition,
  getMousePositionInSvg,
} from './hillMath';


interface HillChartProps {
  scopes: Scope[];
  onUpdatePosition: (id: string, position: number) => void;
  onCommitPosition?: (id: string, oldPosition: number, newPosition: number) => void;
  originPositions?: Record<string, number>; // scope id → current position (shown as ghost in goal mode)
}

const DOT_RADIUS = 8;
const GHOST_RADIUS = 6;
const NUDGE_STEP = 0.01;
const hillPath = generateHillPath();

export default function HillChart({ scopes, onUpdatePosition, onCommitPosition, originPositions }: HillChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dragStartPos = useRef<number | null>(null);

  const handleMouseDown = useCallback((id: string) => {
    const scope = scopes.find((s) => s.id === id);
    dragStartPos.current = scope?.position ?? 0;
    setDraggingId(id);
    setSelectedId(id);
  }, [scopes]);

  useEffect(() => {
    if (!draggingId) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      const { x } = getMousePositionInSvg(e.clientX, e.clientY, svgRef.current);
      const position = svgXToPosition(x);
      onUpdatePosition(draggingId, position);
    };

    const handleMouseUp = () => {
      if (onCommitPosition && dragStartPos.current !== null) {
        const scope = scopes.find((s) => s.id === draggingId);
        if (scope) onCommitPosition(draggingId, dragStartPos.current, scope.position);
      }
      dragStartPos.current = null;
      setDraggingId(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingId, onUpdatePosition, onCommitPosition, scopes]);

  useEffect(() => {
    if (!draggingId) return;

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!svgRef.current) return;
      const touch = e.touches[0];
      const { x } = getMousePositionInSvg(touch.clientX, touch.clientY, svgRef.current);
      const position = svgXToPosition(x);
      onUpdatePosition(draggingId, position);
    };

    const handleTouchEnd = () => {
      if (onCommitPosition && dragStartPos.current !== null) {
        const scope = scopes.find((s) => s.id === draggingId);
        if (scope) onCommitPosition(draggingId!, dragStartPos.current, scope.position);
      }
      dragStartPos.current = null;
      setDraggingId(null);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [draggingId, onUpdatePosition]);

  // Keyboard nudge for selected scope
  useEffect(() => {
    if (!selectedId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      let delta = 0;
      if (e.key === 'ArrowLeft' || e.key === 'h') delta = -NUDGE_STEP;
      else if (e.key === 'ArrowRight' || e.key === 'l') delta = NUDGE_STEP;
      else if (e.key === 'Escape') { setSelectedId(null); return; }
      else return;

      e.preventDefault();
      const scope = scopes.find((s) => s.id === selectedId);
      if (scope) {
        const newPos = Math.max(0, Math.min(1, scope.position + delta));
        onUpdatePosition(selectedId, newPos);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, scopes, onUpdatePosition]);

  // Deselect when clicking outside the SVG
  useEffect(() => {
    if (!selectedId) return;

    const handleClick = (e: MouseEvent) => {
      if (svgRef.current && !svgRef.current.contains(e.target as Node)) {
        setSelectedId(null);
      }
    };

    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [selectedId]);

  const midX = PADDING + CHART_WIDTH / 2;
  const baselineY = SVG_HEIGHT - PADDING;

  return (
    <div className="bg-bg-default border border-border-muted rounded-lg p-4">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        className="block w-full h-auto"
      >
        {originPositions && (
          <defs>
            {scopes.map((scope) => (
              <marker key={scope.id} id={`goal-arrow-${scope.id}`} markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill={scope.color} />
              </marker>
            ))}
          </defs>
        )}

        {/* Baseline */}
        <line
          x1={PADDING}
          y1={baselineY}
          x2={PADDING + CHART_WIDTH}
          y2={baselineY}
          stroke="var(--border-muted)"
          strokeWidth={1}
        />

        {/* Midline */}
        <line
          x1={midX}
          y1={PADDING - 10}
          x2={midX}
          y2={baselineY}
          stroke="var(--border-muted)"
          strokeWidth={1}
          strokeDasharray="4 4"
        />

        {/* Hill curve */}
        <path
          d={hillPath}
          fill="none"
          stroke="var(--border-default)"
          strokeWidth={2}
        />

        {/* Labels */}
        <text
          x={PADDING + CHART_WIDTH * 0.25}
          y={baselineY + 25}
          textAnchor="middle"
          fill="var(--fg-muted)"
          fontSize={12}
        >
          Figuring it out
        </text>
        <text
          x={PADDING + CHART_WIDTH * 0.75}
          y={baselineY + 25}
          textAnchor="middle"
          fill="var(--fg-muted)"
          fontSize={12}
        >
          Making it happen
        </text>

        {/* Origin ghosts and arrows (goal mode) */}
        {originPositions && scopes.map((scope) => {
          const originPos = originPositions[scope.id];
          if (originPos == null || Math.abs(originPos - scope.position) < 0.005) return null;
          const origin = positionToPoint(originPos);
          const goal = positionToPoint(scope.position);
          // Shorten arrow so it ends at the edge of the goal dot
          const dx = goal.x - origin.x;
          const dy = goal.y - origin.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pullback = DOT_RADIUS + 12; // dot radius + arrow marker length + gap
          const arrowX = dist > pullback ? goal.x - (dx / dist) * pullback : goal.x;
          const arrowY = dist > pullback ? goal.y - (dy / dist) * pullback : goal.y;
          return (
            <g key={`origin-${scope.id}`}>
              <line
                x1={origin.x} y1={origin.y}
                x2={arrowX} y2={arrowY}
                stroke={scope.color}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                markerEnd={`url(#goal-arrow-${scope.id})`}
                opacity={0.5}
              />
              <circle
                cx={origin.x} cy={origin.y}
                r={GHOST_RADIUS}
                fill="none"
                stroke={scope.color}
                strokeWidth={2}
                strokeDasharray="3 2"
                opacity={0.5}
              />
            </g>
          );
        })}

        {/* Scope dots */}
        {scopes.map((scope) => {
          const { x, y } = positionToPoint(scope.position);
          const isDragging = draggingId === scope.id;
          const isSelected = selectedId === scope.id;
          return (
            <g key={scope.id}>
              <circle
                cx={x}
                cy={y}
                r={DOT_RADIUS}
                fill={scope.color}
                stroke="var(--bg-default)"
                strokeWidth={2}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                onMouseDown={() => handleMouseDown(scope.id)}
                onTouchStart={() => handleMouseDown(scope.id)}
              />
              <text
                x={scope.position > 0.7 ? x - DOT_RADIUS - 4 : x + DOT_RADIUS + 4}
                y={y + 4}
                textAnchor={scope.position > 0.7 ? 'end' : 'start'}
                fill="var(--fg-default)"
                fontSize={11}
                style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none' }}
                onMouseDown={() => handleMouseDown(scope.id)}
                onTouchStart={() => handleMouseDown(scope.id)}
              >
                {scope.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
