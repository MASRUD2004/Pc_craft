import Link from "next/link";

export default function Home() {
  const builds = [
    {
      name: "Budget Gaming PC",
      price: "$600",
      desc: "Perfect for entry level 1080p gaming.",
    },
    {
      name: "Mid Range Gaming PC",
      price: "$1000",
      desc: "Smooth 1440p gaming and productivity.",
    },
    {
      name: "High Performance PC",
      price: "$1500",
      desc: "High refresh gaming and streaming.",
    },
    {
      name: "Enthusiast PC",
      price: "$2200",
      desc: "Extreme performance and future proof.",
    },
    {
      name: "Ultimate Workstation",
      price: "$3500",
      desc: "For creators, engineers and developers.",
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center py-28 px-6">
        <h1 className="text-5xl font-bold mb-6">Build Your Dream PC</h1>

        <p className="max-w-xl text-gray-300 mb-10">
          Explore powerful PC builds, compare components, check benchmarks and
          create the perfect machine for gaming, work or creativity.
        </p>

        {/* PC IMAGE */}
        <div className="mb-10">
          <img
            src="/pc-build.png"
            alt="PC Build"
            className="w-[420px] mx-auto rounded-xl shadow-lg shadow-purple-600/30"
          />
        </div>

        {/* BUTTON */}
        <Link href="/build">
          <button className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold transition">
            Let's Get Started
          </button>
        </Link>
      </section>

      {/* BUILDS SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Recommended PC Builds
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {builds.map((build, index) => (
            <div
              key={index}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-purple-600 transition"
            >
              <h3 className="text-xl font-semibold mb-2">{build.name}</h3>

              <p className="text-purple-400 font-bold mb-3">{build.price}</p>

              <p className="text-gray-400 mb-6">{build.desc}</p>

              <Link href={`/builds/${index}`}>
                <button className="bg-purple-600 px-5 py-2 rounded-md hover:bg-purple-700 transition">
                  Read More
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
