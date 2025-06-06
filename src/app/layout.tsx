import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Orbitron } from "next/font/google";
import "./globals.css";
// src/app/layout.tsx

import '@xyflow/react/dist/style.css'; // <--- ДОБАВЬ ЭТУ СТРОКУ

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'arial']
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: 'swap'
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable} ${orbitron.variable}`}>
        {children}
      </body>
    </html>
  );
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'arial']
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  fallback: ['ui-monospace', 'monospace']
});

export const metadata: Metadata = {
  title: "React Flow Visual Logic Builder",
  description: "Визуальный конструктор логических схем с поддержкой узлов обработки данных",
};


