import '../styles/globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Vivere',
  description: 'AI-powered journaling app. Remember to live.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
