import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const builds = [
  {
    name: "Frost Nova Build",
    price: "$600",
    // New verified White/Snow build
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1000&auto=format&fit=crop",
    desc: "Cool entry-level gaming PC with clean icy performance."
  },
  {
    name: "Lava Core Build",
    price: "$1000",
    image: "https://images.unsplash.com/photo-1587202399724-4f0580795493?q=80&w=1000&auto=format&fit=crop",
    desc: "A fiery mid-range beast for 1440p gaming."
  },
  {
    name: "Neon Phantom Build",
    price: "$1500",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
    desc: "Cyberpunk RGB machine for creators and streamers."
  },
  {
    name: "Obsidian Apex Build",
    price: "$2200",
    // New verified Stealth Black build
    image: "https://images.unsplash.com/photo-1625842268584-8f3bf9ff16a0?q=80&w=1000&auto=format&fit=crop",
    desc: "Elite blacked-out performance machine."
  },
  {
    name: "Cosmic Titan Build",
    price: "$3500",
    // New verified Workstation build
    image: "https://images.unsplash.com/photo-1614014614573-4683168a6c31?q=80&w=1000&auto=format&fit=crop",
    desc: "Ultimate workstation for AI and rendering."
  }
];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center py-20 px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Build Your Dream PC
        </h1>
        <p className="max-w-xl text-gray-400 mb-10 text-lg">
          Explore powerful PC builds, compare components, and design your perfect machine.
        </p>

        {/* HERO IMAGE - Optimized with 'priority' to load instantly */}
        <div className="relative w-full max-w-2xl aspect-video mb-10 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-purple-500/20">
          <Image 
            src="https://images.unsplash.com/photo-1587202399724-4f0580795493?auto=format&fit=crop&q=80&w=800"
            alt="Main PC Build"
            fill
            priority
            className="object-cover"
          />
        </div>

        <Link href="/build">
          <button className="bg-purple-600 hover:bg-purple-700 px-10 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-600/40">
            Let's Get Started
          </button>
        </Link>
      </section>

      {/* CARDS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center tracking-tight">
          Recommended Builds
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {builds.map((build, index) => (
            <div key={index} className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300">
              <div className="relative h-48 w-full">
                <Image 
                  src={build.image} 
                  alt={build.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{build.name}</h3>
                <p className="text-purple-400 font-mono font-bold mb-3">{build.price}</p>
                <p className="text-zinc-500 text-sm mb-6 leading-relaxed">{build.desc}</p>
                <Link href={`/builds/${index}`}>
                  <button className="w-full bg-zinc-800 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}