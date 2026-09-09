'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      // `enableSystem` was previously false with a hard `defaultTheme="dark"`,
      // so a visitor whose OS is set to light was given a dark site and no
      // indication the preference had been ignored. Defaulting to "system"
      // honours it, and the explicit toggle still wins once used.
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
