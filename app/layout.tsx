import type { Metadata } from 'next';
import Providers from './providers'; 

export const metadata: Metadata = {
  title: 'Mentor Match',
  description: 'A Next.js with TS app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}