import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast'; // 👈 IMPORT ADDED
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "LuxWatch - Timeless Elegance",
  description: "Discover luxury watches crafted for those who appreciate perfection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* 👇 TOASTER ADDED HERE */}
        <Toaster 
          position="top-center" 
          reverseOrder={false} 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
        
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}