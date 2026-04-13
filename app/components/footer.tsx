import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-zinc-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-purple-600 rounded-sm" />
              <span className="text-xl font-bold tracking-tighter">
                PC<span className="text-purple-500">CRAFT</span>
              </span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Precision tools for high-performance PC building. 
              Built for enthusiasts, by enthusiasts.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">Platform</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link href="/builder" className="hover:text-purple-400 transition">System Builder</Link></li>
              <li><Link href="/builds" className="hover:text-purple-400 transition">Completed Builds</Link></li>
              <li><Link href="/guide" className="hover:text-purple-400 transition">Build Guides</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">Community</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link href="#" className="hover:text-purple-400 transition">Discord</Link></li>
              <li><Link href="#" className="hover:text-purple-400 transition">Forums</Link></li>
              <li><Link href="#" className="hover:text-purple-400 transition">Submit a Build</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">Hardware Alerts</h4>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-purple-500"
              />
              <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-500 hover:text-white transition">
                Join
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 text-xs">
          <p>© {new Date().getFullYear()} PCCRAFT. All hardware data is for informational purposes.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/cookies" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}