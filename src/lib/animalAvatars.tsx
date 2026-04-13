import { ReactNode } from 'react';

// Simple SVG animal faces, designed to fit in a small circle
const animals: Record<string, ReactNode> = {
  Fox: (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <polygon points="6,4 12,14 2,14" fill="currentColor" opacity="0.8" />
      <polygon points="26,4 20,14 30,14" fill="currentColor" opacity="0.8" />
      <circle cx="16" cy="18" r="10" fill="currentColor" opacity="0.6" />
      <circle cx="12" cy="16" r="2" fill="white" />
      <circle cx="20" cy="16" r="2" fill="white" />
      <circle cx="12" cy="16" r="1" fill="#1f2328" />
      <circle cx="20" cy="16" r="1" fill="#1f2328" />
      <ellipse cx="16" cy="21" rx="2" ry="1.5" fill="#1f2328" />
    </svg>
  ),
  Owl: (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <circle cx="16" cy="18" r="11" fill="currentColor" opacity="0.6" />
      <polygon points="8,8 12,14 4,14" fill="currentColor" opacity="0.8" />
      <polygon points="24,8 20,14 28,14" fill="currentColor" opacity="0.8" />
      <circle cx="12" cy="16" r="4" fill="white" />
      <circle cx="20" cy="16" r="4" fill="white" />
      <circle cx="12" cy="16" r="2" fill="#1f2328" />
      <circle cx="20" cy="16" r="2" fill="#1f2328" />
      <polygon points="16,20 14,23 18,23" fill="#9a6700" />
    </svg>
  ),
  Bear: (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <circle cx="8" cy="8" r="5" fill="currentColor" opacity="0.7" />
      <circle cx="24" cy="8" r="5" fill="currentColor" opacity="0.7" />
      <circle cx="16" cy="18" r="11" fill="currentColor" opacity="0.6" />
      <circle cx="12" cy="16" r="2" fill="white" />
      <circle cx="20" cy="16" r="2" fill="white" />
      <circle cx="12" cy="16" r="1" fill="#1f2328" />
      <circle cx="20" cy="16" r="1" fill="#1f2328" />
      <ellipse cx="16" cy="21" rx="3" ry="2" fill="currentColor" opacity="0.4" />
      <ellipse cx="16" cy="21" rx="1.5" ry="1" fill="#1f2328" />
    </svg>
  ),
  Wolf: (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <polygon points="5,2 12,16 2,16" fill="currentColor" opacity="0.8" />
      <polygon points="27,2 20,16 30,16" fill="currentColor" opacity="0.8" />
      <circle cx="16" cy="19" r="10" fill="currentColor" opacity="0.6" />
      <circle cx="12" cy="17" r="2" fill="white" />
      <circle cx="20" cy="17" r="2" fill="white" />
      <circle cx="12" cy="17" r="1" fill="#1f2328" />
      <circle cx="20" cy="17" r="1" fill="#1f2328" />
      <ellipse cx="16" cy="22" rx="2" ry="1.5" fill="#1f2328" />
    </svg>
  ),
  Hawk: (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <circle cx="16" cy="18" r="10" fill="currentColor" opacity="0.6" />
      <circle cx="11" cy="16" r="3" fill="white" />
      <circle cx="21" cy="16" r="3" fill="white" />
      <circle cx="11" cy="16" r="1.5" fill="#1f2328" />
      <circle cx="21" cy="16" r="1.5" fill="#1f2328" />
      <polygon points="16,19 13,24 19,24" fill="#9a6700" />
      <line x1="8" y1="12" x2="13" y2="14" stroke="currentColor" strokeWidth="2" opacity="0.8" />
      <line x1="24" y1="12" x2="19" y2="14" stroke="currentColor" strokeWidth="2" opacity="0.8" />
    </svg>
  ),
  Deer: (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <line x1="10" y1="14" x2="6" y2="2" stroke="currentColor" strokeWidth="2" opacity="0.8" />
      <line x1="6" y1="5" x2="3" y2="2" stroke="currentColor" strokeWidth="2" opacity="0.8" />
      <line x1="22" y1="14" x2="26" y2="2" stroke="currentColor" strokeWidth="2" opacity="0.8" />
      <line x1="26" y1="5" x2="29" y2="2" stroke="currentColor" strokeWidth="2" opacity="0.8" />
      <circle cx="16" cy="19" r="10" fill="currentColor" opacity="0.6" />
      <circle cx="12" cy="17" r="2" fill="white" />
      <circle cx="20" cy="17" r="2" fill="white" />
      <circle cx="12" cy="17" r="1" fill="#1f2328" />
      <circle cx="20" cy="17" r="1" fill="#1f2328" />
      <ellipse cx="16" cy="22" rx="1.5" ry="1" fill="#1f2328" />
    </svg>
  ),
  Cat: (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <polygon points="6,4 12,16 2,16" fill="currentColor" opacity="0.8" />
      <polygon points="26,4 20,16 30,16" fill="currentColor" opacity="0.8" />
      <circle cx="16" cy="19" r="10" fill="currentColor" opacity="0.6" />
      <ellipse cx="12" cy="17" rx="2.5" ry="2" fill="#cef5a0" />
      <ellipse cx="20" cy="17" rx="2.5" ry="2" fill="#cef5a0" />
      <ellipse cx="12" cy="17" rx="1" ry="2" fill="#1f2328" />
      <ellipse cx="20" cy="17" rx="1" ry="2" fill="#1f2328" />
      <ellipse cx="16" cy="22" rx="1.5" ry="1" fill="#ffb6c1" />
      <line x1="5" y1="20" x2="12" y2="21" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <line x1="27" y1="20" x2="20" y2="21" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
    </svg>
  ),
  Panda: (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <circle cx="16" cy="18" r="11" fill="white" />
      <circle cx="10" cy="14" r="5" fill="currentColor" opacity="0.8" />
      <circle cx="22" cy="14" r="5" fill="currentColor" opacity="0.8" />
      <circle cx="10" cy="14" r="2" fill="white" />
      <circle cx="22" cy="14" r="2" fill="white" />
      <circle cx="10" cy="14" r="1" fill="#1f2328" />
      <circle cx="22" cy="14" r="1" fill="#1f2328" />
      <ellipse cx="16" cy="20" rx="2" ry="1.5" fill="#1f2328" />
      <circle cx="8" cy="7" r="4" fill="currentColor" opacity="0.8" />
      <circle cx="24" cy="7" r="4" fill="currentColor" opacity="0.8" />
    </svg>
  ),
  Frog: (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <circle cx="10" cy="10" r="6" fill="currentColor" opacity="0.7" />
      <circle cx="22" cy="10" r="6" fill="currentColor" opacity="0.7" />
      <ellipse cx="16" cy="20" rx="12" ry="8" fill="currentColor" opacity="0.5" />
      <circle cx="10" cy="10" r="3" fill="white" />
      <circle cx="22" cy="10" r="3" fill="white" />
      <circle cx="10" cy="10" r="1.5" fill="#1f2328" />
      <circle cx="22" cy="10" r="1.5" fill="#1f2328" />
      <path d="M10,22 Q16,26 22,22" fill="none" stroke="#1f2328" strokeWidth="1.5" />
    </svg>
  ),
  Bunny: (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <ellipse cx="11" cy="8" rx="3" ry="8" fill="currentColor" opacity="0.7" />
      <ellipse cx="21" cy="8" rx="3" ry="8" fill="currentColor" opacity="0.7" />
      <ellipse cx="11" cy="8" rx="1.5" ry="5" fill="#ffb6c1" opacity="0.6" />
      <ellipse cx="21" cy="8" rx="1.5" ry="5" fill="#ffb6c1" opacity="0.6" />
      <circle cx="16" cy="20" r="10" fill="currentColor" opacity="0.6" />
      <circle cx="12" cy="18" r="2" fill="white" />
      <circle cx="20" cy="18" r="2" fill="white" />
      <circle cx="12" cy="18" r="1" fill="#1f2328" />
      <circle cx="20" cy="18" r="1" fill="#1f2328" />
      <ellipse cx="16" cy="22" rx="1.5" ry="1" fill="#ffb6c1" />
    </svg>
  ),
};

export const ANIMAL_NAMES = Object.keys(animals);

// Each animal has a fixed color so identity is visually consistent
export const ANIMAL_COLORS: Record<string, string> = {
  Fox: '#e16f24',
  Owl: '#9a6700',
  Bear: '#7d4e00',
  Wolf: '#656d76',
  Hawk: '#d1242f',
  Deer: '#1a7f37',
  Cat: '#8250df',
  Panda: '#1f2328',
  Frog: '#116329',
  Bunny: '#cf222e',
};

export function AnimalAvatar({ animal }: { animal: string }) {
  return <>{animals[animal] || animals.Fox}</>;
}
