// src/app/layout.tsx
'use client'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'ionicons/icons';
import ClientApolloProvider from '../ClientApolloProvider';
import { usePathname } from 'next/navigation';
import Navbar from './(conponants)/NavBar';

const inter = Inter({ subsets: ['latin'] });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noNavRoutes = ["/login", "/otp"]
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientApolloProvider>
          {!noNavRoutes.includes(pathname) && <Navbar />}
          {children}
</ClientApolloProvider>
        <script
          type="module"
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
        ></script>
        <script
          noModule
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
        ></script>
      </body>
    </html>
  );
}
