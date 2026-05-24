import Link from "next/link";

export default function Header() {
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

        {/* NAVIGATION */}
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
        </div>

      </div>
    </header>
  );
}