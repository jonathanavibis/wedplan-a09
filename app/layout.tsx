import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'WedPlan — Premier Wedding Planning Platform & Marketplace',
  description:
    'Discover top-rated wedding venues, photographers, florists, caterers, and beauty stylists. Book verified wedding vendors and plan your dream celebration effortlessly.',
  keywords: ['wedding', 'wedding planning', 'vendors', 'photography', 'venues', 'catering', 'wedding dress'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fffbf9] text-stone-900 flex flex-col antialiased">
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1c1917',
                color: '#fff',
                fontSize: '14px',
                borderRadius: '12px',
                padding: '12px 18px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#e11d48',
                  secondary: '#fff',
                },
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
