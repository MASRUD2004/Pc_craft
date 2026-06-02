// components/PartPickerLayout.tsx

"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Item {
  id: string;
  name: string;
  manufacturer: string;
  price: string | number;

  // CPU
  socket?: string;
  socket_type?: string;
  cores?: number;
  threads?: number;
  clock?: string | number;
  boost_clock?: string | number;
  tdp?: number;
  generation?: string;
  supported_ram?: string[];

  // GPU
  vram?: number;
  length?: number;

  // RAM
  ram_type?: string;
  type?: string;
  capacity?: string | number;
  speed?: string | number;
  cas_latency?: string;
  color?: string;

  // Motherboard
  chipset?: string;
  form_factor?: string;

  // Storage
  interface?: string;
  read_speed?: number;
  write_speed?: number;
  spec2?: string;

  // PSU
  wattage?: number;
  efficiency?: string;
  modular?: string;
  pcie_12vhpwr?: boolean;

  // Case
  side_panel?: string;
  max_gpu_length?: number;

  // Cooler
  radiator_size?: string;
  height?: number;

  // Case (extended compatibility)
  supported_mb_form_factors?: string[];
  max_cooler_height?: number;
  max_radiator_size?: number | null;

  // Generic
  spec1?: string;
  seller?: string;

  [key: string]: unknown;
}

interface FilterConfig {
  label: string;
  key: string;
  type: "category" | "number";
}

interface LayoutProps {
  title: string;
  data: Item[];
  paramKey: "cpu" | "motherboard" | "ram" | "gpu" | "case" | "storage" | "psu" | "cooler";
  filterConfigs?: FilterConfig[];
  allCpuData?: Item[];
}

// ─── Spec Badge ────────────────────────────────────────────────────────────────
function SpecBadge({ label, value, color = "zinc" }: { label: string; value: string | number; color?: string }) {
  const colorMap: Record<string, string> = {
    purple: "bg-purple-900/40 border-purple-700/40 text-purple-300",
    blue:   "bg-blue-900/40 border-blue-700/40 text-blue-300",
    emerald:"bg-emerald-900/40 border-emerald-700/40 text-emerald-300",
    amber:  "bg-amber-900/40 border-amber-700/40 text-amber-300",
    rose:   "bg-rose-900/40 border-rose-700/40 text-rose-300",
    cyan:   "bg-cyan-900/40 border-cyan-700/40 text-cyan-300",
    orange: "bg-orange-900/40 border-orange-700/40 text-orange-300",
    sky:    "bg-sky-900/40 border-sky-700/40 text-sky-300",
    zinc:   "bg-zinc-800/60 border-zinc-700/40 text-zinc-300",
    lime:   "bg-lime-900/40 border-lime-700/40 text-lime-300",
    fuchsia:"bg-fuchsia-900/40 border-fuchsia-700/40 text-fuchsia-300",
    teal:   "bg-teal-900/40 border-teal-700/40 text-teal-300",
  };
  return (
    <span className={`inline-flex flex-col px-2.5 py-1 rounded-lg border text-[10px] leading-tight ${colorMap[color] ?? colorMap.zinc}`}>
      <span className="opacity-60 font-medium uppercase tracking-wider" style={{ fontSize: "9px" }}>{label}</span>
      <span className="font-semibold text-xs mt-0.5">{value}</span>
    </span>
  );
}

// ─── Per-type spec renderers ───────────────────────────────────────────────────
function CpuSpecs({ item }: { item: Item }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {item.generation && <SpecBadge label="Gen" value={item.generation} color="blue" />}
      {(item.socket || item.socket_type) && <SpecBadge label="Socket" value={(item.socket || item.socket_type) as string} color="purple" />}
      {item.cores && <SpecBadge label="Cores" value={item.cores} color="emerald" />}
      {item.threads && <SpecBadge label="Threads" value={item.threads} color="teal" />}
      {item.clock && <SpecBadge label="Base Clock" value={`${item.clock}`} color="amber" />}
      {item.boost_clock && <SpecBadge label="Boost Clock" value={`${item.boost_clock}`} color="orange" />}
      {item.tdp && <SpecBadge label="TDP" value={`${item.tdp}W`} color="rose" />}
      {item.supported_ram && item.supported_ram.length > 0 && (
        <SpecBadge label="RAM Support" value={item.supported_ram.join(" / ")} color="cyan" />
      )}
    </div>
  );
}

function GpuSpecs({ item }: { item: Item }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {item.spec1 && <SpecBadge label="Brand" value={item.spec1} color="purple" />}
      {item.vram && <SpecBadge label="VRAM" value={`${item.vram} GB`} color="emerald" />}
      {item.clock && <SpecBadge label="Boost Clock" value={`${item.clock} MHz`} color="amber" />}
      {item.length && <SpecBadge label="Card Length" value={`${item.length} mm`} color="cyan" />}
      {item.seller && <SpecBadge label="Seller" value={item.seller} color="zinc" />}
    </div>
  );
}

function RamSpecs({ item }: { item: Item }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {(item.type || item.ram_type) && <SpecBadge label="Standard" value={(item.type || item.ram_type) as string} color="purple" />}
      {item.capacity && <SpecBadge label="Capacity" value={item.capacity as string} color="emerald" />}
      {item.speed && <SpecBadge label="Speed" value={item.speed as string} color="amber" />}
      {item.cas_latency && <SpecBadge label="CL Timing" value={item.cas_latency} color="cyan" />}
      {item.color && <SpecBadge label="Color" value={item.color} color="zinc" />}
    </div>
  );
}

function MotherboardSpecs({ item }: { item: Item }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {item.socket && <SpecBadge label="Socket" value={item.socket} color="purple" />}
      {item.chipset && <SpecBadge label="Chipset" value={item.chipset} color="blue" />}
      {item.form_factor && <SpecBadge label="Form Factor" value={item.form_factor} color="emerald" />}
      {item.ram_type && <SpecBadge label="RAM Type" value={item.ram_type} color="cyan" />}
    </div>
  );
}

function StorageSpecs({ item }: { item: Item }) {
  const capacityLabel = item.capacity
    ? Number(item.capacity) >= 1000
      ? `${(Number(item.capacity) / 1000).toFixed(0)} TB`
      : `${item.capacity} GB`
    : null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {item.spec2 && <SpecBadge label="Type" value={item.spec2} color="purple" />}
      {capacityLabel && <SpecBadge label="Capacity" value={capacityLabel} color="emerald" />}
      {item.interface && <SpecBadge label="Interface" value={item.interface} color="blue" />}
      {item.form_factor && <SpecBadge label="Form Factor" value={item.form_factor} color="zinc" />}
      {item.read_speed && <SpecBadge label="Read Speed" value={`${item.read_speed} MB/s`} color="amber" />}
      {item.write_speed && <SpecBadge label="Write Speed" value={`${item.write_speed} MB/s`} color="orange" />}
      {item.seller && <SpecBadge label="Seller" value={item.seller} color="zinc" />}
    </div>
  );
}

function PsuSpecs({ item }: { item: Item }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {item.wattage && <SpecBadge label="Wattage" value={`${item.wattage}W`} color="amber" />}
      {item.efficiency && <SpecBadge label="Efficiency" value={item.efficiency} color="emerald" />}
      {item.modular && <SpecBadge label="Modular" value={item.modular} color="blue" />}
      {item.pcie_12vhpwr !== undefined && (
        <SpecBadge
          label="PCIe 12VHPWR"
          value={item.pcie_12vhpwr ? "Yes" : "No"}
          color={item.pcie_12vhpwr ? "cyan" : "zinc"}
        />
      )}
    </div>
  );
}

function CaseSpecs({ item }: { item: Item }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {item.form_factor && <SpecBadge label="Form Factor" value={item.form_factor} color="purple" />}
      {item.color && <SpecBadge label="Color" value={item.color} color="zinc" />}
      {item.side_panel && <SpecBadge label="Side Panel" value={item.side_panel} color="cyan" />}
      {item.max_gpu_length && <SpecBadge label="Max GPU" value={`${item.max_gpu_length} mm`} color="amber" />}
      {item.max_cooler_height && <SpecBadge label="Max Air Cooler" value={`${item.max_cooler_height} mm`} color="emerald" />}
      {item.max_radiator_size && <SpecBadge label="Max Radiator" value={`${item.max_radiator_size} mm`} color="blue" />}
      {item.supported_mb_form_factors && (
        <SpecBadge label="MB Support" value={(item.supported_mb_form_factors as string[]).join(" / ")} color="fuchsia" />
      )}
    </div>
  );
}

function CoolerSpecs({ item }: { item: Item }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {item.type && <SpecBadge label="Type" value={item.type} color="purple" />}
      {item.radiator_size && <SpecBadge label="Radiator" value={item.radiator_size} color="blue" />}
      {item.height && <SpecBadge label="Height" value={`${item.height} mm`} color="emerald" />}
      {item.color && <SpecBadge label="Color" value={item.color} color="zinc" />}
    </div>
  );
}

function ItemSpecs({ item, paramKey }: { item: Item; paramKey: string }) {
  switch (paramKey) {
    case "cpu":         return <CpuSpecs item={item} />;
    case "gpu":         return <GpuSpecs item={item} />;
    case "ram":         return <RamSpecs item={item} />;
    case "motherboard": return <MotherboardSpecs item={item} />;
    case "storage":     return <StorageSpecs item={item} />;
    case "psu":         return <PsuSpecs item={item} />;
    case "case":        return <CaseSpecs item={item} />;
    case "cooler":      return <CoolerSpecs item={item} />;
    default:            return null;
  }
}

// ─── Main Layout ────────────────────────────────────────────────────────────────
export default function PartPickerLayout({
  title,
  data,
  paramKey,
  filterConfigs,
  allCpuData = [],
}: LayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Record<string, string[]>>({});
  const [numericRanges, setNumericRanges] = useState<Record<string, { min: number; max: number }>>({});
  const [filtersOpen, setFiltersOpen] = useState(false);

  const parseToNum = (val: unknown): number => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    return parseFloat(String(val).replace(/[^0-9.]/g, "")) || 0;
  };

  // ── Compatibility Engine ─────────────────────────────────────────────────────
  const compatibleData = useMemo(() => {
    const activeCpuId = searchParams.get("cpu_id");
    const activeCpuSocket = searchParams.get("cpu_socket")?.toUpperCase();
    const selectedCpuObj = allCpuData.find((cpu) => String(cpu.id) === String(activeCpuId));
    const cpuSupportedRam = selectedCpuObj?.supported_ram?.map((r: string) => r.toUpperCase()) || [];

    const activeMbSocket = searchParams.get("motherboard_socket")?.toUpperCase();
    const activeMbRamType = searchParams.get("motherboard_ram_type")?.toUpperCase();
    const activeMbFormFactor = searchParams.get("motherboard_form_factor");

    const activeGpuLength = Number(searchParams.get("gpu_length")) || 0;

    const activeCaseGpuLength = Number(searchParams.get("case_max_gpu_length")) || 0;
    const activeCaseCoolerHeight = Number(searchParams.get("case_max_cooler_height")) || 0;
    const activeCaseRadiatorSize = Number(searchParams.get("case_max_radiator_size")) || 0;
    const activeCaseMbFormFactors: string[] = JSON.parse(searchParams.get("case_supported_mb_form_factors") || "[]");

    const activeCoolerHeight = Number(searchParams.get("cooler_height")) || 0;
    const activeCoolerRadiatorSize = Number(searchParams.get("cooler_radiator_size")?.replace("mm", "") || "0") || 0;

    const activeRamType = (searchParams.get("ram_type") || searchParams.get("type"))?.toUpperCase();

    return data.filter((item) => {
      const itemSocket = (item.socket || item.socket_type || "").toUpperCase();
      const itemRamType = (item.type || item.ram_type || "").toUpperCase();
      const itemSupportedRam = item.supported_ram?.map((r: string) => r.toUpperCase()) || [];
      const caseGpuClearance = Number(item.max_gpu_length) || 0;
      const caseCoolerClearance = Number(item.max_cooler_height) || 0;
      const caseRadiatorClearance = Number(item.max_radiator_size) || 0;
      const caseSupportedMbFFs: string[] = (item.supported_mb_form_factors as string[]) || [];
      const gpuLength = Number(item.length) || 0;
      const coolerHeight = Number(item.height) || 0;
      const coolerRadiatorSize = Number(String(item.radiator_size || "").replace("mm", "")) || 0;

      // ── CPU ──────────────────────────────────────────────────────────────────
      if (paramKey === "cpu") {
        if (activeMbSocket && itemSocket !== activeMbSocket) return false;
        if (activeMbRamType && !itemSupportedRam.includes(activeMbRamType)) return false;
        if (!activeMbSocket && activeRamType && !itemSupportedRam.includes(activeRamType)) return false;
      }

      // ── Motherboard ──────────────────────────────────────────────────────────
      if (paramKey === "motherboard") {
        if (activeCpuSocket && itemSocket !== activeCpuSocket) return false;
        if (activeRamType && itemRamType !== activeRamType) return false;
        if (cpuSupportedRam.length > 0 && !cpuSupportedRam.includes(itemRamType)) return false;
        // Case must support this motherboard's form factor
        if (activeCaseMbFormFactors.length > 0 && !activeCaseMbFormFactors.includes(item.form_factor as string)) return false;
      }

      // ── RAM ──────────────────────────────────────────────────────────────────
      if (paramKey === "ram") {
        if (activeMbRamType && itemRamType !== activeMbRamType) return false;
        if (!activeMbRamType && cpuSupportedRam.length > 0 && !cpuSupportedRam.includes(itemRamType)) return false;
        if (activeMbSocket) {
          if (activeMbSocket === "AM5" && itemRamType !== "DDR5") return false;
          if (activeMbSocket === "AM4" && itemRamType !== "DDR4") return false;
        }
      }

      // ── GPU ──────────────────────────────────────────────────────────────────
      if (paramKey === "gpu") {
        if (activeCaseGpuLength && gpuLength > activeCaseGpuLength) return false;
      }

      // ── Case ─────────────────────────────────────────────────────────────────
      if (paramKey === "case") {
        // GPU length clearance
        if (activeGpuLength && caseGpuClearance < activeGpuLength) return false;
        // Motherboard form factor support
        if (activeMbFormFactor && caseSupportedMbFFs.length > 0 && !caseSupportedMbFFs.includes(activeMbFormFactor)) return false;
        // Air cooler height clearance
        if (activeCoolerHeight && caseCoolerClearance < activeCoolerHeight) return false;
        // AIO radiator clearance
        if (activeCoolerRadiatorSize && caseRadiatorClearance < activeCoolerRadiatorSize) return false;
      }

      // ── CPU Cooler ───────────────────────────────────────────────────────────
      if (paramKey === "cooler") {
        // Air cooler: check height fits in case
        if (coolerHeight && activeCaseCoolerHeight && coolerHeight > activeCaseCoolerHeight) return false;
        // AIO: check radiator fits in case
        if (coolerRadiatorSize && activeCaseRadiatorSize && coolerRadiatorSize > activeCaseRadiatorSize) return false;
      }

      return true;
    });
  }, [data, paramKey, searchParams, allCpuData]);

  // ── Filter Configs ───────────────────────────────────────────────────────────
  const finalConfigs = useMemo(() => {
    if (filterConfigs) return filterConfigs;

    const targetSocketKey = data.some((item) => "socket_type" in item) ? "socket_type" : "socket";
    const targetRamKey = data.some((item) => "type" in item) ? "type" : "ram_type";

    const configs: FilterConfig[] = [{ label: "Manufacturer", key: "manufacturer", type: "category" }];

    if (paramKey === "motherboard") {
      configs.push(
        { label: "Socket Platform", key: "socket", type: "category" },
        { label: "RAM Generation", key: "ram_type", type: "category" },
        { label: "Form Factor", key: "form_factor", type: "category" },
        { label: "Chipset", key: "chipset", type: "category" }
      );
    }
    if (paramKey === "cpu") {
      configs.push(
        { label: "Socket Platform", key: targetSocketKey, type: "category" },
        { label: "Generation", key: "generation", type: "category" },
        { label: "Core Count", key: "cores", type: "number" }
      );
    }
    if (paramKey === "ram") {
      configs.push(
        { label: "RAM Standard", key: targetRamKey, type: "category" },
        { label: "Capacity", key: "capacity", type: "category" },
        { label: "Speed", key: "speed", type: "category" }
      );
    }
    if (paramKey === "gpu") {
      configs.push(
        { label: "Brand", key: "spec1", type: "category" },
        { label: "VRAM (GB)", key: "vram", type: "number" }
      );
    }
    if (paramKey === "storage") {
      configs.push(
        { label: "Type", key: "spec2", type: "category" },
        { label: "Interface", key: "interface", type: "category" }
      );
    }
    if (paramKey === "psu") {
      configs.push(
        { label: "Efficiency", key: "efficiency", type: "category" },
        { label: "Modular", key: "modular", type: "category" },
        { label: "Wattage", key: "wattage", type: "number" }
      );
    }
    if (paramKey === "case") {
      configs.push(
        { label: "Form Factor", key: "form_factor", type: "category" },
        { label: "Color", key: "color", type: "category" }
      );
    }
    if (paramKey === "cooler") {
      configs.push(
        { label: "Type", key: "type", type: "category" },
        { label: "Color", key: "color", type: "category" }
      );
    }

    configs.push({ label: "Price", key: "price", type: "number" });
    return configs;
  }, [filterConfigs, paramKey, data]);

  const filterMeta = useMemo(() => {
    const categories: Record<string, string[]> = {};
    const bounds: Record<string, { absoluteMin: number; absoluteMax: number }> = {};

    finalConfigs.forEach(({ key, type }) => {
      if (type === "number") {
        const numbers = compatibleData.map((item) => parseToNum(item[key]));
        bounds[key] = {
          absoluteMin: numbers.length ? Math.min(...numbers) : 0,
          absoluteMax: numbers.length ? Math.max(...numbers) : 1000,
        };
      } else {
        categories[key] = Array.from(
          new Set(compatibleData.map((item) => item[key]).filter(Boolean))
        ) as string[];
      }
    });
    return { categories, bounds };
  }, [compatibleData, finalConfigs]);

  const filteredData = useMemo(() => {
    return compatibleData.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesConfigs = finalConfigs.every(({ key, type }) => {
        if (type === "number") {
          const itemVal = parseToNum(item[key]);
          const absolute = filterMeta.bounds[key];
          if (!absolute) return true;
          const currentRange = numericRanges[key] || { min: absolute.absoluteMin, max: absolute.absoluteMax };
          return itemVal >= currentRange.min && itemVal <= currentRange.max;
        }
        const activeFilters = selectedCategories[key] || [];
        if (activeFilters.length === 0) return true;
        return activeFilters.includes(item[key] as string);
      });
      return matchesSearch && matchesConfigs;
    });
  }, [search, compatibleData, selectedCategories, numericRanges, finalConfigs, filterMeta.bounds]);

  // ── Select Part ──────────────────────────────────────────────────────────────
  const handleSelect = (item: Item) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const formattedPrice = typeof item.price === "number" ? `$${item.price.toFixed(2)}` : item.price;

    currentParams.set(`${paramKey}_name`, item.name);
    currentParams.set(`${paramKey}_price`, formattedPrice);

    // GPU: store length for case compatibility
    if (paramKey === "gpu" && item.length) currentParams.set("gpu_length", String(item.length));

    // CPU: store id for RAM lookup
    if (paramKey === "cpu") currentParams.set("cpu_id", String(item.id));

    // Case: store all clearance/support values
    if (paramKey === "case") {
      if (item.max_gpu_length) currentParams.set("case_max_gpu_length", String(item.max_gpu_length));
      if (item.max_cooler_height) currentParams.set("case_max_cooler_height", String(item.max_cooler_height));
      if (item.max_radiator_size) currentParams.set("case_max_radiator_size", String(item.max_radiator_size));
      if (item.supported_mb_form_factors) currentParams.set("case_supported_mb_form_factors", JSON.stringify(item.supported_mb_form_factors));
    }

    // Motherboard: store form factor for case compatibility
    if (paramKey === "motherboard" && item.form_factor) {
      currentParams.set("motherboard_form_factor", item.form_factor);
    }

    // Cooler: store height (air) and radiator size (AIO) for case compatibility
    if (paramKey === "cooler") {
      if (item.height) currentParams.set("cooler_height", String(item.height));
      if (item.radiator_size) currentParams.set("cooler_radiator_size", item.radiator_size);
    }

    // Socket
    const extractionSocket = item.socket || item.socket_type;
    if (extractionSocket) {
      currentParams.set(`${paramKey}_socket`, extractionSocket);
      if (paramKey === "motherboard") currentParams.set("motherboard_socket", extractionSocket);
      if (paramKey === "cpu") currentParams.set("cpu_socket", extractionSocket);
    }

    // RAM type
    let extractionRam = item.type || item.ram_type || item.generation;
    if (!extractionRam && item.name) {
      if (item.name.toUpperCase().includes("DDR5")) extractionRam = "DDR5";
      if (item.name.toUpperCase().includes("DDR4")) extractionRam = "DDR4";
    }
    if (extractionRam) {
      const cleanRam = extractionRam.toUpperCase();
      if (paramKey === "ram") currentParams.set("ram_type", cleanRam);
      else currentParams.set(`${paramKey}_ram_type`, cleanRam);
      if (paramKey === "motherboard") currentParams.set("motherboard_ram_type", cleanRam);
      if (paramKey === "ram") currentParams.set("motherboard_ram_type", cleanRam);
    }

    router.push(`/build?${currentParams.toString()}`);
  };

  const activeFilterCount = Object.values(selectedCategories).filter((v) => v.length > 0).length +
    Object.keys(numericRanges).length;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-950 text-white" style={{ fontFamily: "'DM Mono', 'Fira Code', monospace" }}>
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/build?${searchParams.toString()}`)}
              className="text-zinc-500 hover:text-white transition-colors text-sm flex items-center gap-1.5"
            >
              ← Back
            </button>
            <span className="text-zinc-700">|</span>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Choose <span className="text-purple-400">{title}</span>
            </h1>
          </div>
          <span className="text-zinc-500 text-sm font-medium">
            {filteredData.length} result{filteredData.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">

        {/* ── Sidebar Filters ── */}
        <aside className="w-64 flex-shrink-0 sticky top-24 self-start h-[calc(100vh-6rem)] overflow-y-auto overflow-x-hidden pr-1">
          <div className="space-y-4 pb-6">
            {/* Search */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">⌕</span>
              <input
                type="text"
                placeholder={`Search ${title}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-4 py-2.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-purple-600 transition-colors"
              />
            </div>

            {/* Filter header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Filters</span>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => { setSelectedCategories({}); setNumericRanges({}); }}
                  className="text-xs text-purple-400 hover:text-purple-300"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Filter blocks */}
            {finalConfigs.map(({ label, key, type }) => {
              if (type === "category") {
                const options = filterMeta.categories[key] || [];
                if (options.length < 2) return null;
                const active = selectedCategories[key] || [];
                return (
                  <div key={key} className="space-y-2">
                    <p className="text-xs text-zinc-500 font-medium">{label}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setSelectedCategories((prev) => {
                              const cur = prev[key] || [];
                              return { ...prev, [key]: cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt] };
                            });
                          }}
                          className={`px-2 py-1 rounded text-xs border transition-all ${
                            active.includes(opt)
                              ? "bg-purple-600 border-purple-500 text-white"
                              : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              // Number range
              const bounds = filterMeta.bounds[key];
              if (!bounds || bounds.absoluteMin === bounds.absoluteMax) return null;
              const current = numericRanges[key] || { min: bounds.absoluteMin, max: bounds.absoluteMax };

              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-500 font-medium">{label}</p>
                    <span className="text-xs text-zinc-400">
                      {key === "price" ? `$${current.min.toFixed(0)} – $${current.max.toFixed(0)}` : `${current.min} – ${current.max}`}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <input
                      type="range"
                      min={bounds.absoluteMin}
                      max={bounds.absoluteMax}
                      value={current.min}
                      onChange={(e) => setNumericRanges((p) => ({ ...p, [key]: { ...current, min: Number(e.target.value) } }))}
                      className="w-full accent-purple-500"
                    />
                    <input
                      type="range"
                      min={bounds.absoluteMin}
                      max={bounds.absoluteMax}
                      value={current.max}
                      onChange={(e) => setNumericRanges((p) => ({ ...p, [key]: { ...current, max: Number(e.target.value) } }))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── Part List ── */}
        <div className="flex-1 min-w-0 space-y-2">
          {filteredData.length === 0 ? (
            <div className="text-center py-24 text-zinc-600">
              <p className="text-4xl mb-3">∅</p>
              <p className="text-sm">No compatible parts found.</p>
              <button
                onClick={() => { setSearch(""); setSelectedCategories({}); setNumericRanges({}); }}
                className="mt-4 text-xs text-purple-400 hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.id}
                className="group bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 hover:bg-zinc-900/90 transition-all duration-150"
              >
                <div className="flex items-start gap-4">
                  {/* Left: Name + brand */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm leading-snug truncate group-hover:text-purple-200 transition-colors">
                      {item.name}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {item.manufacturer || item.spec1}
                    </p>

                    {/* Specs row */}
                    <div className="mt-2.5">
                      <ItemSpecs item={item} paramKey={paramKey} />
                    </div>
                  </div>

                  {/* Right: Price + Select */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0 pl-4">
                    <span className="text-lg font-bold text-purple-400 tabular-nums">
                      ${parseToNum(item.price).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleSelect(item)}
                      className="bg-purple-600 hover:bg-purple-500 active:scale-95 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-100 whitespace-nowrap"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}