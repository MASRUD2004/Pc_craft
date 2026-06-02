// app/ram/page.tsx

"use client";

import { useEffect, useState } from "react";
import PartPickerLayout from "../partPickerLayout";
import LoadingSpinner from "../loadingSpinner";

export default function RamPage() {
  const [ramData, setRamData] = useState([]);
  const [cpuData, setCpuData] = useState([]); // 🔥 ADD THIS
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔥 LOAD BOTH RAM + CPU DATA
    Promise.all([
      fetch("/ram.json").then((res) => res.json()),
      fetch("/cpu.json").then((res) => res.json()),
    ])
      .then(([ramJson, cpuJson]) => {
        setRamData(ramJson);

        // 🔥 SAVE CPU DATA
        setCpuData(cpuJson);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading ram.json:", err);
        setLoading(false);
      });
  }, []);

  // =========================================================
  // FILTER CONFIGS
  // =========================================================
  const ramFilterConfigs = [
    {
      label: "Brand",
      key: "manufacturer",
      type: "category",
    },

    {
      label: "Memory Type",
      key: "type",
      type: "category",
    },

    {
      label: "Price ($)",
      key: "price",
      type: "number",
    },

    {
      label: "Total Capacity",
      key: "capacity",
      type: "category",
    },

    {
      label: "Speed",
      key: "speed",
      type: "category",
    },

    {
      label: "Color",
      key: "color",
      type: "category",
    },
  ];

  if (loading) {
    return <LoadingSpinner item="RAM modules" />;
  }

  // =========================================================
  // PAGE
  // =========================================================
  return (
    <PartPickerLayout
      title="Memory (RAM)"
      data={ramData}

      // 🔥 IMPORTANT FIX
      paramKey="ram"

      filterConfigs={ramFilterConfigs}

      // 🔥 CRITICAL FIX
      allCpuData={cpuData}
    />
  );
}