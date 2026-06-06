import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HillRadar — Find the least-crowded hill station",
  description: "Real-time crowding scores for hill stations near Delhi. Find your escape before the traffic hits.",
  keywords: "hill stations, Delhi, Shimla, Manali, travel, crowd tracker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
