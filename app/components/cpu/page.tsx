// app/cpu/page.tsx

"use client";

import { useEffect, useState } from "react";
import PartPickerLayout from "../partPickerLayout";

export default function CpuPage() {
  const [cpuData, setCpuData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/cpu.json")
      .then((res) => res.json())
      .then((data) => {
        setCpuData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading cpu.json:", err);
        setLoading(false);
      });
  }, []);

  // =========================================================
  // FILTER CONFIGS
  // =========================================================
  const cpuFilterConfigs = [
    {
      label: "Manufacturer",
      key: "spec1",
      type: "category",
    },

    {
      label: "Price",
      key: "price",
      type: "number",
    },

    {
      label: "Core Count",
      key: "cores",
      type: "number",
    },

    {
      label: "Thread Count",
      key: "threads",
      type: "number",
    },

    {
      label: "Seller Platform",
      key: "seller",
      type: "category",
    },
  ];

  // =========================================================
  // LOADING SCREEN
  // =========================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center font-sans">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="text-sm font-medium">
            Loading processors...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================
  return (
    <PartPickerLayout
      title="Processor (CPU)"
      data={cpuData}
      paramKey="cpu"
      filterConfigs={cpuFilterConfigs}

      // 🔥 CRITICAL FIX
      allCpuData={cpuData}
    />
  );
}