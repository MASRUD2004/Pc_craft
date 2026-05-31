"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-purple-600 rounded-lg rotate-3 group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-xl font-black tracking-tighter text-white">
            PC<span className="text-purple-500">CRAFT</span>
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-10">
          <Link href="/build" className="text-sm font-medium text-zinc-400 hover:text-purple-400 transition-colors">
            Builder
          </Link>
          <Link href="/builds" className="text-sm font-medium text-zinc-400 hover:text-purple-400 transition-colors">
            Completed Builds
          </Link>
          <Link href="/parts" className="text-sm font-medium text-zinc-400 hover:text-purple-400 transition-colors">
            Browse Parts
          </Link>
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-sm font-semibold text-zinc-400 hover:text-white transition">
            Sign In
          </button>

          {/* HAMBURGER BUTTON — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {menuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-black/95 backdrop-blur-md px-6 py-4 flex flex-col gap-4">
          <Link
            href="/build"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-zinc-400 hover:text-purple-400 transition-colors py-2"
          >
            Builder
          </Link>
          <Link
            href="/builds"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-zinc-400 hover:text-purple-400 transition-colors py-2"
          >
            Completed Builds
          </Link>
          <Link
            href="/parts"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-zinc-400 hover:text-purple-400 transition-colors py-2"
          >
            Browse Parts
          </Link>
          <button className="text-left text-sm font-semibold text-zinc-400 hover:text-white transition py-2">
            Sign In
          </button>
        </div>
      )}
    </header>
  );
}