"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface Part {
  name: string;
  selected: string | null;
  price: string | null;
  routePath: string;
}

function BuildPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. CORE PC COMPONENTS TEMPLATE
  const [coreBuild, setCoreBuild] = useState<Record<string, Part>>({
    cpu: { name: "CPU", selected: null, price: null, routePath: "/components/cpu" },
    cooler: { name: "CPU Cooler", selected: null, price: null, routePath: "/components/cpu_cooler" },
    motherboard: { name: "Motherboard", selected: null, price: null, routePath: "/components/motherboard" },
    memory: { name: "Memory (RAM)", selected: null, price: null, routePath: "/components/ram" },
    storage: { name: "Storage (SSD/HDD)", selected: null, price: null, routePath: "/components/storage" },
    gpu: { name: "Graphics Card (GPU)", selected: null, price: null, routePath: "/components/gpu" },
    case: { name: "PC Case", selected: null, price: null, routePath: "/components/pc_case" },
    psu: { name: "Power Supply (PSU)", selected: null, price: null, routePath: "/components/powersupply" },
  });

  // 2. PERIPHERALS, FANS & ACCESSORIES TEMPLATE
  const [peripherals, setPeripherals] = useState<Record<string, Part>>({
    caseFans: { name: "Case Fans", selected: null, price: null, routePath: "/components/case_fans" },
    monitor: { name: "Monitor", selected: null, price: null, routePath: "/components/monitor" },
    keyboard: { name: "Keyboard", selected: null, price: null, routePath: "/components/keyboard" },
    mouse: { name: "Mouse", selected: null, price: null, routePath: "/components/mouse" },
    headset: { name: "Headset / Speakers", selected: null, price: null, routePath: "/components/audio" },
    os: { name: "Operating System", selected: null, price: null, routePath: "/components/os" },
  });

  // 3. READ PARAMS, SYNC STORAGE AND AGGREGATE ACCUMULATED STATE CLEANLY
  useEffect(() => {
    let activeParams = new URLSearchParams(searchParams.toString());
    
    // Check if there are any active selections inside the current address bar
    const hasUrlParams = Array.from(activeParams.keys()).some(k => k.endsWith("_name"));

    // FIX STEP A: If url is empty, attempt recovery from local disk backup cache
    if (!hasUrlParams) {
      const savedBuildString = localStorage.getItem("pc_craft_build_backups");
      if (savedBuildString) {
        try {
          activeParams = new URLSearchParams(savedBuildString);
          // Restore query strings silently into address tracking route state
          router.replace(`?${activeParams.toString()}`);
        } catch (e) {
          console.error("Failed parsing localStorage backup bundle:", e);
        }
      }
    }

    // Generate fresh structural copies from baseline configurations on parse ticks
    const baselineCore = {
      cpu: { name: "CPU", selected: null, price: null, routePath: "/components/cpu" },
      cooler: { name: "CPU Cooler", selected: null, price: null, routePath: "/components/cpu_cooler" },
      motherboard: { name: "Motherboard", selected: null, price: null, routePath: "/components/motherboard" },
      memory: { name: "Memory (RAM)", selected: null, price: null, routePath: "/components/ram" },
      storage: { name: "Storage (SSD/HDD)", selected: null, price: null, routePath: "/components/storage" },
      gpu: { name: "Graphics Card (GPU)", selected: null, price: null, routePath: "/components/gpu" },
      case: { name: "PC Case", selected: null, price: null, routePath: "/components/pc_case" },
      psu: { name: "Power Supply (PSU)", selected: null, price: null, routePath: "/components/powersupply" },
    };

    const baselinePeripherals = {
      caseFans: { name: "Case Fans", selected: null, price: null, routePath: "/components/case_fans" },
      monitor: { name: "Monitor", selected: null, price: null, routePath: "/components/monitor" },
      keyboard: { name: "Keyboard", selected: null, price: null, routePath: "/components/keyboard" },
      mouse: { name: "Mouse", selected: null, price: null, routePath: "/components/mouse" },
      headset: { name: "Headset / Speakers", selected: null, price: null, routePath: "/components/audio" },
      os: { name: "Operating System", selected: null, price: null, routePath: "/components/os" },
    };

    // Populate allocations safely across all matching data arrays in the URL context
    activeParams.forEach((value, key) => {
      if (key.endsWith("_name")) {
        const componentKey = key.replace("_name", "");
        const priceValue = activeParams.get(`${componentKey}_price`);

        if (baselineCore[componentKey]) {
          baselineCore[componentKey].selected = value;
          baselineCore[componentKey].price = priceValue;
        } else if (baselinePeripherals[componentKey]) {
          baselinePeripherals[componentKey].selected = value;
          baselinePeripherals[componentKey].price = priceValue;
        }
      }
    });

    setCoreBuild(baselineCore);
    setPeripherals(baselinePeripherals);

    // FIX STEP B: Backup current parameters state to storage if parts exist
    if (Array.from(activeParams.keys()).length > 0) {
      localStorage.setItem("pc_craft_build_backups", activeParams.toString());
    }
  }, [searchParams, router]);

  const calculateTotal = () => {
    const combinedParts = [...Object.values(coreBuild), ...Object.values(peripherals)];
    return combinedParts.reduce((acc, part) => {
      return acc + (part.price ? parseFloat(part.price.replace("$", "")) : 0);
    }, 0).toFixed(2);
  };

  // REMOVE PART FUNCTION BY UPDATING THE QUERY STRING & DISK BACKUP STORAGE
  const handleRemovePart = (componentKey: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(`${componentKey}_name`);
    params.delete(`${componentKey}_price`);
    
    // FIX STEP C: Keep storage mirrored upon item removal cycles
    const remainingParams = Array.from(params.keys()).some(k => k.endsWith("_name"));
    if (!remainingParams) {
      localStorage.removeItem("pc_craft_build_backups");
    } else {
      localStorage.setItem("pc_craft_build_backups", params.toString());
    }

    router.push(`?${params.toString()}`);
  };

  const renderTableRows = (partList: Record<string, Part>) => {
    return Object.entries(partList).map(([key, part]) => {
      // FORWARD CURRENT CONFIGS: Ensures selecting a new part doesn't lose old components
      const dynamicRoute = `${part.routePath}?${searchParams.toString()}`;

      return (
        <tr key={key} className="hover:bg-zinc-900/40 transition-colors">
          <td className="p-4 font-medium text-purple-400 hover:underline">
            <Link href={dynamicRoute} className="block w-full select-none">
              {part.name}
            </Link>
          </td>
          
          <td className="p-4">
            {part.selected ? (
              <span className="font-medium text-zinc-200">{part.selected}</span>
            ) : (
              <Link href={dynamicRoute}>
                <button className="text-xs bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/20 px-3 py-1.5 rounded-md font-medium transition">
                  + Choose {part.name}
                </button>
              </Link>
            )}
          </td>
          
          <td className="p-4 text-right font-semibold text-zinc-300">
            {part.price || "—"}
          </td>

          <td className="p-4 text-center">
            {part.selected && (
              <button 
                onClick={() => handleRemovePart(key)}
                className="text-zinc-500 hover:text-red-400 transition text-base"
                title="Remove component"
              >
                ✕
              </button>
            )}
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="min-h-screen p-8 bg-zinc-950 text-white font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-40">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">System Builder</h1>
            <p className="text-xs text-zinc-400 mt-0.5">Select components to build your customized system configuration</p>
          </div>
          <div className="text-right">
            <span className="text-sm text-zinc-400">Estimated Wattage: </span>
            <span className="text-sm font-bold text-green-400">—</span>
          </div>
        </div>

        {/* CORE HARDWARE BUILD SECTION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-purple-500 rounded-full" />
            <h2 className="text-lg font-bold tracking-tight text-zinc-100">Core Components</h2>
          </div>
          <div className="overflow-x-auto border border-zinc-800 rounded-xl bg-zinc-900/50 backdrop-blur-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900 text-zinc-400 uppercase text-xs tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="p-4 font-semibold w-1/4">Component</th>
                  <th className="p-4 font-semibold w-1/2">Selection</th>
                  <th className="p-4 font-semibold text-right w-1/6">Price</th>
                  <th className="p-4 font-semibold text-center w-1/12">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {renderTableRows(coreBuild)}
              </tbody>
            </table>
          </div>
        </div>

        {/* PERIPHERALS & ACCESSORIES SECTION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-purple-500 rounded-full" />
            <h2 className="text-lg font-bold tracking-tight text-zinc-100">Peripherals, Accessories & Fans</h2>
          </div>
          <div className="overflow-x-auto border border-zinc-800 rounded-xl bg-zinc-900/50 backdrop-blur-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900 text-zinc-400 uppercase text-xs tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="p-4 font-semibold w-1/4">Component</th>
                  <th className="p-4 font-semibold w-1/2">Selection</th>
                  <th className="p-4 font-semibold text-right w-1/6">Price</th>
                  <th className="p-4 font-semibold text-center w-1/12">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {renderTableRows(peripherals)}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOTAL BUDGET BAR */}
        <div className="p-5 flex justify-between items-center border border-zinc-800 bg-zinc-900/40 backdrop-blur-md rounded-xl shadow-lg shadow-purple-950/10">
          <div>
            <span className="text-sm font-medium text-zinc-400 block">System Total running budget</span>
            <span className="text-xs text-zinc-500">Includes core modules and added peripheral configurations</span>
          </div>
          <span className="text-2xl font-black text-purple-400 tracking-tight">
            ${calculateTotal()}
          </span>
        </div>

      </div>
    </div>
  );
}

export default function BuildPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 text-white p-8">Loading Builder Config...</div>}>
      <BuildPageContent />
    </Suspense>
  );
}