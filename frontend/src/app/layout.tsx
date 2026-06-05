import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI FAQ Assistant',
  description: 'Ask anything, get intelligent answers powered by Gemini AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
