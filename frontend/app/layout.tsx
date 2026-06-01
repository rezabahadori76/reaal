import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import { LocaleProvider } from '@/lib/i18n';
import './globals.css';

export const metadata: Metadata = {
  title: 'MulkPlus | Smart Property Finance',
  description: 'Integrated property purchase and mortgage finance platform for Oman.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <LocaleProvider>
          <AuthProvider>{children}</AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
