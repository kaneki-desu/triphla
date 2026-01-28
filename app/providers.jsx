"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SessionProvider 
    //   refetchInterval={0} refetchOnWindowFocus={false}
      >
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}
