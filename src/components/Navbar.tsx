"use client";

import Link from "next/link";
import { Home, HelpCircle, List } from "lucide-react";

export default function Navbar() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="w-full flex items-center justify-between py-6 px-8 max-w-7xl mx-auto">
      {/* Logo Area */}
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#0056b3] text-white flex items-center justify-center font-bold text-lg">
          Y
        </div>
        <span className="font-bold text-xl tracking-tight">youtubebot</span>
      </Link>

      {/* Links Area */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4b5563]">
        <Link href="/" className="flex items-center gap-2 hover:text-black transition-colors">
          <Home className="w-4 h-4" /> Inicio
        </Link>
        <button 
          onClick={() => scrollToSection("como-funciona")} 
          className="flex items-center gap-2 hover:text-black transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" /> Cómo funciona
        </button>
        <Link 
          href="/cola"
          className="flex items-center gap-2 hover:text-black transition-colors cursor-pointer"
        >
          <List className="w-4 h-4" /> Cola
        </Link>
      </div>
    </nav>
  );
}
