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

// =========================================================
// CONSTANTS — defined once, reused everywhere
// =========================================================
const INITIAL_CORE_BUILD: Record<string, Part> = {
  cpu:         { name: "CPU",                 selected: null, price: null, routePath: "/components/cpu" },
  cooler:      { name: "CPU Cooler",          selected: null, price: null, routePath: "/components/cpu_cooler" },
  motherboard: { name: "Motherboard",         selected: null, price: null, routePath: "/components/motherboard" },
  ram:         { name: "Memory (RAM)",        selected: null, price: null, routePath: "/components/ram" },
  storage:     { name: "Storage (SSD/HDD)",   selected: null, price: null, routePath: "/components/storage" },
  gpu:         { name: "Graphics Card (GPU)", selected: null, price: null, routePath: "/components/gpu" },
  case:        { name: "PC Case",             selected: null, price: null, routePath: "/components/pc_case" },
  psu:         { name: "Power Supply (PSU)",  selected: null, price: null, routePath: "/components/powersupply" },
};

const INITIAL_PERIPHERALS: Record<string, Part> = {
  caseFans: { name: "Case Fans",          selected: null, price: null, routePath: "/components/case_fans" },
  monitor:  { name: "Monitor",            selected: null, price: null, routePath: "/components/monitor" },
  keyboard: { name: "Keyboard",           selected: null, price: null, routePath: "/components/keyboard" },
  mouse:    { name: "Mouse",              selected: null, price: null, routePath: "/components/mouse" },
  headset:  { name: "Headset / Speakers", selected: null, price: null, routePath: "/components/audio" },
  os:       { name: "Operating System",   selected: null, price: null, routePath: "/components/os" },
};

// Deep-clone so mutations never affect the originals
const cloneCoreBuild = () => JSON.parse(JSON.stringify(INITIAL_CORE_BUILD));
const clonePeripherals = () => JSON.parse(JSON.stringify(INITIAL_PERIPHERALS));

function BuildPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [coreBuild, setCoreBuild] = useState<Record<string, Part>>(cloneCoreBuild);
  const [peripherals, setPeripherals] = useState<Record<string, Part>>(clonePeripherals);

  const hasSelectedParts =
    Object.values(coreBuild).some((p) => p.selected) ||
    Object.values(peripherals).some((p) => p.selected);

  const gpuLength = Number(searchParams.get("gpu_length")) || 0;
  const caseMaxGpuLength = Number(searchParams.get("case_max_gpu_length")) || 0;
  const gpuFits = gpuLength > 0 && caseMaxGpuLength > 0 && gpuLength <= caseMaxGpuLength;

  useEffect(() => {
    let activeParams = new URLSearchParams(searchParams.toString());
    const hasUrlParams = Array.from(activeParams.keys()).some((k) =>
      k.endsWith("_name"),
    );

    if (!hasUrlParams) {
      const savedBuildString = localStorage.getItem("pc_craft_build_backups");
      if (savedBuildString) {
        try {
          activeParams = new URLSearchParams(savedBuildString);
          router.replace(`?${activeParams.toString()}`);
        } catch (e) {
          console.error("Failed parsing localStorage backup bundle:", e);
        }
      }
    }

    // Start from clean clones — never mutate the originals
    const baselineCore = cloneCoreBuild();
    const baselinePeripherals = clonePeripherals();

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

    if (Array.from(activeParams.keys()).length > 0) {
      localStorage.setItem("pc_craft_build_backups", activeParams.toString());
    }
  }, [searchParams, router]);

  const calculateTotal = () => {
    return [...Object.values(coreBuild), ...Object.values(peripherals)]
      .reduce((acc, part) => {
        return acc + (part.price ? parseFloat(part.price.replace("$", "")) : 0);
      }, 0)
      .toFixed(2);
  };

  const handleRemovePart = (componentKey: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(`${componentKey}_name`);
    params.delete(`${componentKey}_price`);
    params.delete(`${componentKey}_socket`);
    params.delete(`${componentKey}_ram_type`);

    if (componentKey === "motherboard") {
      params.delete("motherboard_socket");
      params.delete("motherboard_ram_type");
    }
    if (componentKey === "cpu") {
      params.delete("cpu_socket");
      params.delete("cpu_id");
    }
    if (componentKey === "ram") params.delete("ram_type");
    if (componentKey === "gpu") params.delete("gpu_length");
    if (componentKey === "case") params.delete("case_max_gpu_length");

    const remainingParams = Array.from(params.keys()).some((k) =>
      k.endsWith("_name"),
    );
    if (!remainingParams) {
      localStorage.removeItem("pc_craft_build_backups");
    } else {
      localStorage.setItem("pc_craft_build_backups", params.toString());
    }

    router.push(`?${params.toString()}`);
  };

  // =========================================================
  // RESELECT HANDLER
  // Clears the old selection for the component, then navigates
  // to the part picker — all other parts remain in URL state.
  // =========================================================
  const handleReselect = (componentKey: string, routePath: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete(`${componentKey}_name`);
    params.delete(`${componentKey}_price`);
    params.delete(`${componentKey}_socket`);
    params.delete(`${componentKey}_ram_type`);

    if (componentKey === "motherboard") {
      params.delete("motherboard_socket");
      params.delete("motherboard_ram_type");
    }
    if (componentKey === "cpu") {
      params.delete("cpu_socket");
      params.delete("cpu_id");
    }
    if (componentKey === "ram") params.delete("ram_type");
    if (componentKey === "gpu") params.delete("gpu_length");
    if (componentKey === "case") params.delete("case_max_gpu_length");

    localStorage.setItem("pc_craft_build_backups", params.toString());
    router.push(`${routePath}?${params.toString()}`);
  };

  const handleClearBuild = () => {
    localStorage.removeItem("pc_craft_build_backups");
    setCoreBuild(cloneCoreBuild());
    setPeripherals(clonePeripherals());
    router.push("?");
  };

  const renderTableRows = (partList: Record<string, Part>) => {
    return Object.entries(partList).map(([key, part]) => {
      const dynamicRoute = `${part.routePath}?${searchParams.toString()}`;

      return (
        <tr key={key} className="hover:bg-zinc-900/40 transition-colors">
          {/* Component Name */}
          <td className="p-4 font-medium text-purple-400 hover:underline">
            <Link href={dynamicRoute} className="block w-full select-none">
              {part.name}
            </Link>
          </td>

          {/* Selection */}
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

          {/* Price */}
          <td className="p-4 text-right font-semibold text-zinc-300">
            {part.price || "—"}
          </td>

          {/* Actions: Reselect + Remove */}
          <td className="p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              {part.selected && (
                <>
                  {/* RESELECT BUTTON */}
                  <button
                    onClick={() => handleReselect(key, part.routePath)}
                    className="text-zinc-500 hover:text-purple-400 transition text-base"
                    title="Reselect component"
                  >
                    ⇄
                  </button>

                  {/* REMOVE BUTTON */}
                  <button
                    onClick={() => handleRemovePart(key)}
                    className="text-zinc-500 hover:text-red-400 transition text-base"
                    title="Remove component"
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="min-h-screen p-8 bg-zinc-950 text-white font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-40">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              System Builder
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select components to build your customized system configuration
            </p>
          </div>
          <div className="flex items-center gap-6">
            {hasSelectedParts && (
              <button
                onClick={handleClearBuild}
                className="text-xs font-semibold text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 px-3 py-2 rounded-lg transition"
              >
                Clear Build
              </button>
            )}
            <div className="text-right">
              <span className="text-sm text-zinc-400">Estimated Wattage: </span>
              <span className="text-sm font-bold text-green-400">—</span>
            </div>
          </div>
        </div>

        {gpuLength > 0 && caseMaxGpuLength > 0 && (
          <div
            className={`p-4 rounded-xl border ${
              gpuFits
                ? "border-green-600 bg-green-950/30"
                : "border-red-600 bg-red-950/30"
            }`}
          >
            {gpuFits ? (
              <p className="text-green-400 font-semibold">
                ✓ GPU Clearance Compatible
              </p>
            ) : (
              <p className="text-red-400 font-semibold">
                ✕ GPU Too Long For Selected Case
              </p>
            )}
            <p className="text-sm text-zinc-400 mt-1">
              GPU Length: {gpuLength} mm | Case Clearance: {caseMaxGpuLength} mm
            </p>
          </div>
        )}

        {/* CORE HARDWARE BUILD SECTION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-purple-500 rounded-full" />
            <h2 className="text-lg font-bold tracking-tight text-zinc-100">
              Core Components
            </h2>
          </div>
          <div className="overflow-x-auto border border-zinc-800 rounded-xl bg-zinc-900/50 backdrop-blur-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900 text-zinc-400 uppercase text-xs tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="p-4 font-semibold w-1/4">Component</th>
                  <th className="p-4 font-semibold w-1/2">Selection</th>
                  <th className="p-4 font-semibold text-right w-1/6">Price</th>
                  <th className="p-4 font-semibold text-center w-1/6">Actions</th>
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
            <h2 className="text-lg font-bold tracking-tight text-zinc-100">
              Peripherals, Accessories & Fans
            </h2>
          </div>
          <div className="overflow-x-auto border border-zinc-800 rounded-xl bg-zinc-900/50 backdrop-blur-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900 text-zinc-400 uppercase text-xs tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="p-4 font-semibold w-1/4">Component</th>
                  <th className="p-4 font-semibold w-1/2">Selection</th>
                  <th className="p-4 font-semibold text-right w-1/6">Price</th>
                  <th className="p-4 font-semibold text-center w-1/6">Actions</th>
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
            <span className="text-sm font-medium text-zinc-400 block">
              System Total running budget
            </span>
            <span className="text-xs text-zinc-500">
              Includes core modules and added peripheral configurations
            </span>
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 text-white p-8">
          Loading Builder Config...
        </div>
      }
    >
      <BuildPageContent />
    </Suspense>
  );
}