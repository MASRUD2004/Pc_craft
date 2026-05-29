// components/PartPickerLayout.tsx

"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Item {
  id: string;
  name: string;
  manufacturer: string;
  price: string | number;

  socket?: string;
  socket_type?: string;

  ram_type?: string;
  type?: string;

  chipset?: string;
  form_factor?: string;
  generation?: string;

  supported_ram?: string[];

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
  paramKey: "cpu" | "motherboard" | "ram";
  filterConfigs?: FilterConfig[];

  // 🔥 IMPORTANT FIX
  allCpuData?: Item[];
}

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

  const [selectedCategories, setSelectedCategories] = useState<
    Record<string, string[]>
  >({});

  const [numericRanges, setNumericRanges] = useState<
    Record<string, { min: number; max: number }>
  >({});

  const parseToNum = (val: any): number => {
    if (typeof val === "number") return val;
    if (!val) return 0;

    return parseFloat(String(val).replace(/[^0-9.]/g, "")) || 0;
  };

  // =========================================================
  // COMPATIBILITY ENGINE
  // =========================================================
  const compatibleData = useMemo(() => {
    // CPU
    const activeCpuId = searchParams.get("cpu_id");

    const activeCpuSocket =
      searchParams.get("cpu_socket")?.toUpperCase();

    // 🔥 FIXED CPU LOOKUP
    const selectedCpuObj = allCpuData.find(
      (cpu) => String(cpu.id) === String(activeCpuId)
    );

    const cpuSupportedRam =
      selectedCpuObj?.supported_ram?.map((r: string) =>
        r.toUpperCase()
      ) || [];

    // Motherboard
    const activeMbSocket =
      searchParams.get("motherboard_socket")?.toUpperCase();

    const activeMbRamType =
      searchParams.get("motherboard_ram_type")?.toUpperCase();

    // RAM
    const activeRamType =
      (
        searchParams.get("ram_type") ||
        searchParams.get("type")
      )?.toUpperCase();

    return data.filter((item) => {
      const itemSocket =
        (item.socket || item.socket_type || "").toUpperCase();

      const itemRamType =
        (item.type || item.ram_type || "").toUpperCase();

      const itemSupportedRam =
        item.supported_ram?.map((r: string) =>
          r.toUpperCase()
        ) || [];

      // =========================================================
      // MOTHERBOARD PAGE
      // =========================================================
      if (paramKey === "motherboard") {
        if (activeCpuSocket && itemSocket !== activeCpuSocket) {
          return false;
        }

        if (activeRamType && itemRamType !== activeRamType) {
          return false;
        }

        if (
          cpuSupportedRam.length > 0 &&
          !cpuSupportedRam.includes(itemRamType)
        ) {
          return false;
        }
      }

      // =========================================================
      // CPU PAGE
      // =========================================================
      if (paramKey === "cpu") {
        if (activeMbSocket && itemSocket !== activeMbSocket) {
          return false;
        }

        if (
          activeMbRamType &&
          !itemSupportedRam.includes(activeMbRamType)
        ) {
          return false;
        }

        if (
          !activeMbSocket &&
          activeRamType &&
          !itemSupportedRam.includes(activeRamType)
        ) {
          return false;
        }
      }

      // =========================================================
      // RAM PAGE
      // =========================================================
      if (paramKey === "ram") {
        if (
          activeMbRamType &&
          itemRamType !== activeMbRamType
        ) {
          return false;
        }

        if (
          !activeMbRamType &&
          cpuSupportedRam.length > 0 &&
          !cpuSupportedRam.includes(itemRamType)
        ) {
          return false;
        }

        // HARD SAFETY RULES
        if (activeMbSocket) {
          if (
            activeMbSocket === "AM5" &&
            itemRamType !== "DDR5"
          ) {
            return false;
          }

          if (
            activeMbSocket === "AM4" &&
            itemRamType !== "DDR4"
          ) {
            return false;
          }
        }
      }

      return true;
    });
  }, [data, paramKey, searchParams, allCpuData]);

  // =========================================================
  // FILTER CONFIG
  // =========================================================
  const finalConfigs = useMemo(() => {
    if (filterConfigs) return filterConfigs;

    const targetSocketKey = data.some(
      (item) => "socket_type" in item
    )
      ? "socket_type"
      : "socket";

    const targetRamKey = data.some(
      (item) => "type" in item
    )
      ? "type"
      : "ram_type";

    const configs: FilterConfig[] = [
      {
        label: "Manufacturer",
        key: "manufacturer",
        type: "category",
      },
    ];

    if (paramKey === "motherboard") {
      configs.push(
        {
          label: "Socket Platform",
          key: "socket",
          type: "category",
        },
        {
          label: "RAM Generation",
          key: "ram_type",
          type: "category",
        },
        {
          label: "Form Factor",
          key: "form_factor",
          type: "category",
        },
        {
          label: "Chipset",
          key: "chipset",
          type: "category",
        }
      );
    }

    if (paramKey === "cpu") {
      configs.push(
        {
          label: "Socket Platform",
          key: targetSocketKey,
          type: "category",
        },
        {
          label: "Generation",
          key: "generation",
          type: "category",
        }
      );
    }

    if (paramKey === "ram") {
      configs.push(
        {
          label: "RAM Standard",
          key: targetRamKey,
          type: "category",
        },
        {
          label: "Capacity",
          key: "capacity",
          type: "category",
        },
        {
          label: "Speed",
          key: "speed",
          type: "category",
        }
      );
    }

    configs.push({
      label: "Price",
      key: "price",
      type: "number",
    });

    return configs;
  }, [filterConfigs, paramKey, data]);

  const filterMeta = useMemo(() => {
    const categories: Record<string, string[]> = {};

    const bounds: Record<
      string,
      { absoluteMin: number; absoluteMax: number }
    > = {};

    finalConfigs.forEach(({ key, type }) => {
      if (type === "number") {
        const numbers = compatibleData.map((item) =>
          parseToNum(item[key])
        );

        const min = numbers.length
          ? Math.min(...numbers)
          : 0;

        const max = numbers.length
          ? Math.max(...numbers)
          : 1000;

        bounds[key] = {
          absoluteMin: min,
          absoluteMax: max,
        };
      } else {
        categories[key] = Array.from(
          new Set(
            compatibleData
              .map((item) => item[key])
              .filter(Boolean)
          )
        ) as string[];
      }
    });

    return { categories, bounds };
  }, [compatibleData, finalConfigs]);

  const filteredData = useMemo(() => {
    return compatibleData.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesConfigs = finalConfigs.every(
        ({ key, type }) => {
          if (type === "number") {
            const itemVal = parseToNum(item[key]);

            const absolute = filterMeta.bounds[key];

            if (!absolute) return true;

            const currentRange = numericRanges[key] || {
              min: absolute.absoluteMin,
              max: absolute.absoluteMax,
            };

            return (
              itemVal >= currentRange.min &&
              itemVal <= currentRange.max
            );
          }

          const activeFilters =
            selectedCategories[key] || [];

          if (activeFilters.length === 0) {
            return true;
          }

          return activeFilters.includes(item[key]);
        }
      );

      return matchesSearch && matchesConfigs;
    });
  }, [
    search,
    compatibleData,
    selectedCategories,
    numericRanges,
    finalConfigs,
    filterMeta.bounds,
  ]);

  // =========================================================
  // SELECT PART
  // =========================================================
  const handleSelect = (item: Item) => {
    const currentParams = new URLSearchParams(
      searchParams.toString()
    );

    const formattedPrice =
      typeof item.price === "number"
        ? `$${item.price.toFixed(2)}`
        : item.price;

    currentParams.set(`${paramKey}_name`, item.name);

    currentParams.set(
      `${paramKey}_price`,
      formattedPrice
    );

    // 🔥 CRITICAL FIX
    if (paramKey === "cpu") {
      currentParams.set("cpu_id", String(item.id));
    }

    // SOCKET
    const extractionSocket =
      item.socket || item.socket_type;

    if (extractionSocket) {
      currentParams.set(
        `${paramKey}_socket`,
        extractionSocket
      );

      if (paramKey === "motherboard") {
        currentParams.set(
          "motherboard_socket",
          extractionSocket
        );
      }

      if (paramKey === "cpu") {
        currentParams.set(
          "cpu_socket",
          extractionSocket
        );
      }
    }

    // RAM TYPE
    let extractionRam =
      item.type ||
      item.ram_type ||
      item.generation;

    if (!extractionRam && item.name) {
      if (
        item.name.toUpperCase().includes("DDR5")
      ) {
        extractionRam = "DDR5";
      }

      if (
        item.name.toUpperCase().includes("DDR4")
      ) {
        extractionRam = "DDR4";
      }
    }

    if (extractionRam) {
      const cleanRam = extractionRam.toUpperCase();

      if (paramKey === "ram") {
        currentParams.set("ram_type", cleanRam);
      } else {
        currentParams.set(
          `${paramKey}_ram_type`,
          cleanRam
        );
      }

      if (paramKey === "motherboard") {
        currentParams.set(
          "motherboard_ram_type",
          cleanRam
        );
      }

      if (paramKey === "ram") {
        currentParams.set(
          "motherboard_ram_type",
          cleanRam
        );
      }
    }

    router.push(`/build?${currentParams.toString()}`);
  };

  return (
    <div className="min-h-screen p-8 bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <h1 className="text-2xl font-bold">
            Choose {title}
          </h1>

          <button
            onClick={() =>
              router.push(
                `/build?${searchParams.toString()}`
              )
            }
            className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm"
          >
            Back
          </button>
        </div>

        <input
          type="text"
          placeholder={`Search ${title}`}
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"
        />

        <div className="border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 border-b border-zinc-800">
              <tr>
                <th className="p-4 text-left">
                  Component
                </th>

                <th className="p-4 text-left">
                  Specs
                </th>

                <th className="p-4 text-right">
                  Price
                </th>

                <th className="p-4 text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item) => {
                const activeRamDisplay =
                  item.type || item.ram_type;

                const activeSocketDisplay =
                  item.socket ||
                  item.socket_type;

                return (
                  <tr
                    key={item.id}
                    className="border-b border-zinc-800"
                  >
                    <td className="p-4">
                      <div className="font-semibold">
                        {item.name}
                      </div>

                      <div className="text-xs text-zinc-500">
                        {item.manufacturer}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {activeSocketDisplay && (
                          <span className="bg-purple-900/40 px-2 py-1 rounded text-xs">
                            {activeSocketDisplay}
                          </span>
                        )}

                        {activeRamDisplay && (
                          <span className="bg-emerald-900/40 px-2 py-1 rounded text-xs">
                            {activeRamDisplay}
                          </span>
                        )}

                        {item.generation && (
                          <span className="bg-blue-900/40 px-2 py-1 rounded text-xs">
                            {item.generation}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-right font-bold text-purple-400">
                      $
                      {parseToNum(item.price).toFixed(2)}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() =>
                          handleSelect(item)
                        }
                        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-xs font-bold"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}