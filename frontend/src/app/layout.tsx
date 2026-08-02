import React from 'react';
import type { Metadata, Viewport } from 'next';
import Fonts from 'Fonts';
import AppWrappers from './AppWrappers';

export const metadata: Metadata = {
  title: 'VerifiNews',
  icons: {
    apple: '/logo192.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body id="root" suppressHydrationWarning>
        <Fonts />
        <AppWrappers>{children}</AppWrappers>
      </body>
    </html>
  );
}