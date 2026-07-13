import { ReactNode } from 'react';

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Module 01: Plain wrapper without context or state.
  // CSS tokens are loaded globally in main.tsx.
  return <>{children}</>;
}
