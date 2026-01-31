import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Chronos | Luxury Timepieces",
  description: "Experience the pinnacle of horological artistry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-black text-white antialiased`}>
        <Navbar />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #D4AF37',
            },
            success: {
              iconTheme: {
                primary: '#D4AF37',
                secondary: '#000',
              },
            },
          }}
        />
        <main className="pt-32 min-h-screen relative z-0">
          {children}
        </main>
      </body>
    </html>
  );
}