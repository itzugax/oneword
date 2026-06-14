import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "losderyutu — El canal de YouTube de todos",
  description: "Sube tu video y el sistema lo publica automáticamente en el canal comunitario @losderyutu. Sin registro. Sin pagar. 100% automático.",
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
      <body className="min-h-full flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        <footer className="text-center py-8 text-gray-400 text-sm w-full bg-[#f9fafb] relative z-20">
          © Ugax. Esta plataforma no está vinculada a YouTube.
        </footer>
      </body>
    </html>
  );
}
