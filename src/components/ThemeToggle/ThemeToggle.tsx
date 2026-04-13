'use client';

import { useTheme } from '@/lib/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-bg-default border border-border-muted cursor-pointer text-fg-muted hover:text-fg-default hover:border-fg-accent transition-colors duration-150"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M9.598 1.591a.749.749 0 01.785-.175 7.001 7.001 0 01-1.516 13.473.75.75 0 01-.61-1.36A5.5 5.5 0 008.5 2.5a5.478 5.478 0 00-2.27.488.75.75 0 01-.573-1.386 6.95 6.95 0 013.941-.011z" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 12a4 4 0 100-8 4 4 0 000 8zM8 0a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V.75A.75.75 0 018 0zm5.657 2.343a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 11-1.061-1.06l1.06-1.06a.75.75 0 011.06 0zM16 8a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0116 8zm-2.343 5.657a.75.75 0 01-1.06 0l-1.06-1.06a.75.75 0 111.06-1.061l1.06 1.06a.75.75 0 010 1.06zM8 16a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0v1.5A.75.75 0 018 16zM2.343 13.657a.75.75 0 010-1.06l1.06-1.06a.75.75 0 111.061 1.06l-1.06 1.06a.75.75 0 01-1.06 0zM0 8a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H.75A.75.75 0 010 8zm2.343-5.657a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.061l-1.06-1.06a.75.75 0 010-1.06z" />
        </svg>
      )}
    </button>
  );
}
