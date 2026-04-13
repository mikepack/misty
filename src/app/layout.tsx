import type { Metadata } from 'next';
import { HillsProvider } from '@/context/HillsContext';
import PasswordGate from '@/components/PasswordGate/PasswordGate';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hill Chart',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var t = localStorage.getItem('hill-chart-theme');
            if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', t);
          })();
        `}} />
      </head>
      <body>
        <ThemeToggle />
        <PasswordGate>
          <HillsProvider>{children}</HillsProvider>
        </PasswordGate>
      </body>
    </html>
  );
}
