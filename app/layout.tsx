import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";

// 1. Import your new components (using relative paths)


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PC CRAFT | Build Your Dream PC",
  description: "The ultimate tool for designing high-performance PC builds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        {/* 2. Place Header at the top */}
        <Header />

        {/* 3. Wrap children in a main tag with 'flex-grow' 
           This pushes the footer to the bottom on short pages */}
        <main className="flex-grow">
          {children}
        </main>

        {/* 4. Place Footer at the bottom */}
        <Footer />
      </body>
    </html>
  );
}
