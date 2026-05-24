"use client";
import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Item {
  id: string;
  name: string;
  spec1: string;
  spec2: string;
  price: string | number;
  [key: string]: any; 
}

interface FilterConfig {
  label: string;
  key: string;
  type: "category" | "number";
}

interface LayoutProps {
  title: string;
  data: Item[];
  paramKey: string;
  filterConfigs?: FilterConfig[];
}

export default function PartPickerLayout({ 
  title, 
  data, 
  paramKey,
  filterConfigs = [
    { label: "Manufacturer", key: "spec1", type: "category" },
    { label: "Price", key: "price", type: "number" }
  ] 
}: LayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams(); // <--- ADDED TO ACCESS ACTIVE QUERY COMPONENT HISTORY
  const [search, setSearch] = useState("");
  
  const [selectedCategories, setSelectedCategories] = useState<Record<string, string[]>>({});
  const [numericRanges, setNumericRanges] = useState<Record<string, { min: number; max: number }>>({});

  const parseToNum = (val: any): number => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    return parseFloat(String(val).replace(/[^0-9.]/g, "")) || 0;
  };

  const filterMeta = useMemo(() => {
    const categories: Record<string, string[]> = {};
    const bounds: Record<string, { absoluteMin: number; absoluteMax: number }> = {};

    filterConfigs.forEach(({ key, type }) => {
      if (type === "number") {
        const numbers = data.map(item => parseToNum(item[key]));
        const min = numbers.length ? Math.min(...numbers) : 0;
        const max = numbers.length ? Math.max(...numbers) : 100;
        bounds[key] = { absoluteMin: min, absoluteMax: max };
      } else {
        categories[key] = Array.from(new Set(data.map(item => item[key]).filter(Boolean))) as string[];
      }
    });

    return { categories, bounds };
  }, [data, filterConfigs]);

  const toggleCategoryOption = (key: string, value: string) => {
    setSelectedCategories((prev) => {
      const current = prev[key] || [];
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const handleRangeChange = (key: string, type: "min" | "max", value: number) => {
    const absolute = filterMeta.bounds[key];
    setNumericRanges((prev) => {
      const current = prev[key] || { min: absolute.absoluteMin, max: absolute.absoluteMax };
      let nextValue = value;
      
      if (type === "min") {
        if (nextValue > current.max) nextValue = current.max;
        if (nextValue < absolute.absoluteMin) nextValue = absolute.absoluteMin;
        return { ...prev, [key]: { ...current, min: nextValue } };
      } else {
        if (nextValue < current.min) nextValue = current.min;
        if (nextValue > absolute.absoluteMax) nextValue = absolute.absoluteMax;
        return { ...prev, [key]: { ...current, max: nextValue } };
      }
    });
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      
      const matchesConfigs = filterConfigs.every(({ key, type }) => {
        if (type === "number") {
          const itemVal = parseToNum(item[key]);
          const absolute = filterMeta.bounds[key];
          const currentRange = numericRanges[key] || { min: absolute.absoluteMin, max: absolute.absoluteMax };
          return itemVal >= currentRange.min && itemVal <= currentRange.max;
        } else {
          const activeFilters = selectedCategories[key] || [];
          if (activeFilters.length === 0) return true;
          return activeFilters.includes(item[key]);
        }
      });

      return matchesSearch && matchesConfigs;
    });
  }, [search, data, selectedCategories, numericRanges, filterConfigs, filterMeta.bounds]);

  // FIXED: APPEND NEW COMPONENT CHOICES ONTO EXISITING ARCHIVE STREAM OBJECTS
  const handleSelect = (name: string, price: string | number) => {
    const formattedPrice = typeof price === "number" ? `$${price.toFixed(2)}` : price;
    
    // Create an editable instance tracking everything in the current URL bar
    const currentParams = new URLSearchParams(searchParams.toString());
    
    // Inject or safely update only this page's component selections
    currentParams.set(`${paramKey}_name`, name);
    currentParams.set(`${paramKey}_price`, formattedPrice);

    // Bounce back home carrying the complete historic selection query string
    router.push(`/build?${currentParams.toString()}`);
  };

  const clearAllFilters = () => {
    setSelectedCategories({});
    setNumericRanges({});
  };

  return (
    <div className="min-h-screen p-8 bg-zinc-950 text-white font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* TOP LAYOUT CONTROL BAR */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <h1 className="text-2xl font-bold tracking-tight">Choose {title}</h1>
          <button 
            onClick={() => router.push(`/build?${searchParams.toString()}`)} // FIXED: Forward tracking state parameters backwards too
            className="text-xs bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition"
          >
            Back to Builder
          </button>
        </div>

        {/* SEARCH INPUT BAR */}
        <input
          type="text"
          placeholder={`Search ${title.toLowerCase()}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-purple-500 transition"
        />

        {/* TWO COLUMN GRID INTERFACE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          
          {/* SIDEBAR: SMART FILTERS MODIFIER */}
          <aside className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <h2 className="font-bold text-sm tracking-wide uppercase text-zinc-400">Filters</h2>
              {(Object.values(selectedCategories).some(arr => arr.length > 0) || Object.keys(numericRanges).length > 0) && (
                <button 
                  onClick={clearAllFilters}
                  className="text-xs text-red-400 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {filterConfigs.map(({ label, key, type }) => {
              if (type === "number") {
                const absolute = filterMeta.bounds[key];
                if (!absolute || absolute.absoluteMin === absolute.absoluteMax) return null;
                
                const currentRange = numericRanges[key] || { min: absolute.absoluteMin, max: absolute.absoluteMax };

                return (
                  <div key={key} className="space-y-3 pb-2">
                    <h3 className="font-semibold text-xs text-purple-400 uppercase tracking-wider">{label}</h3>
                    
                    {/* Slider Input Row */}
                    <div className="space-y-1">
                      <input
                        type="range"
                        min={absolute.absoluteMin}
                        max={absolute.absoluteMax}
                        value={currentRange.max}
                        onChange={(e) => handleRangeChange(key, "max", parseFloat(e.target.value))}
                        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                    </div>

                    {/* Manual Editable Input Fields */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-1/2">
                        <span className="text-[10px] text-zinc-500 block mb-0.5">Min</span>
                        <input
                          type="number"
                          value={Math.round(currentRange.min)}
                          onChange={(e) => handleRangeChange(key, "min", parseFloat(e.target.value) || 0)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div className="w-1/2">
                        <span className="text-[10px] text-zinc-500 block mb-0.5">Max</span>
                        <input
                          type="number"
                          value={Math.round(currentRange.max)}
                          onChange={(e) => handleRangeChange(key, "max", parseFloat(e.target.value) || 0)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              }

              const options = filterMeta.categories[key] || [];
              if (options.length === 0) return null;

              return (
                <div key={key} className="space-y-2">
                  <h3 className="font-semibold text-xs text-purple-400 uppercase tracking-wider">{label}</h3>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                    {options.map((option) => (
                      <label key={option} className="flex items-center space-x-2.5 text-xs text-zinc-400 cursor-pointer hover:text-zinc-200 select-none">
                        <input
                          type="checkbox"
                          checked={(selectedCategories[key] || []).includes(option)}
                          onChange={() => toggleCategoryOption(key, option)}
                          className="rounded border-zinc-800 bg-zinc-950 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </aside>

          {/* PRODUCT LIST MATRIX TABLE */}
          <main className="md:col-span-3 border border-zinc-800 rounded-xl bg-zinc-900/40 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900 text-zinc-400 uppercase text-xs tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Specifications</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-sm text-zinc-500">
                      No components match your set criteria ranges.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-900/20 transition-colors">
                      <td className="p-4 font-semibold text-zinc-200">
                        {item.name}
                        {item.seller && (
                          <span className="block text-[10px] text-zinc-500 font-normal mt-0.5">
                            Seller: {item.seller}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-zinc-400">
                        <div className="flex flex-wrap gap-1.5">
                          {item.spec1 && <span className="bg-zinc-800/50 border border-zinc-700/30 px-2 py-0.5 rounded text-xs">{item.spec1}</span>}
                          {item.spec2 && <span className="bg-zinc-800/50 border border-zinc-700/30 px-2 py-0.5 rounded text-xs">{item.spec2}</span>}
                          {item.cores && <span className="bg-purple-950/30 border border-purple-800/20 px-2 py-0.5 rounded text-xs text-purple-300">{item.cores} Cores</span>}
                        </div>
                      </td>
                      <td className="p-4 text-right font-bold text-purple-400">
                        {typeof item.price === "number" ? `$${item.price.toFixed(2)}` : item.price}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleSelect(item.name, item.price)}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </main>

        </div>
      </div>
    </div>
  );
}