// app/motherboard/page.tsx

"use client";

import { useEffect, useState } from "react";
import PartPickerLayout from "../partPickerLayout";
import LoadingSpinner from "../loadingSpinner";

export default function MotherboardPage() {
  const [moboData, setMoboData] = useState([]);
  const [cpuData, setCpuData] = useState([]); // 🔥 ADD THIS
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔥 LOAD BOTH DATASETS
    Promise.all([
      fetch("/motherboard.json").then((res) => res.json()),
      fetch("/cpu.json").then((res) => res.json()),
    ])
      .then(([motherboardJson, cpuJson]) => {
        setMoboData(motherboardJson);

        // 🔥 SAVE CPU DATA
        setCpuData(cpuJson);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        setLoading(false);
      });
  }, []);

  // =========================================================
  // FILTER CONFIGS
  // =========================================================
  const moboFilterConfigs = [
    {
      label: "Manufacturer",
      key: "spec1",
      type: "category",
    },

    {
      label: "Socket & Chipset",
      key: "spec2",
      type: "category",
    },

    {
      label: "Price ($)",
      key: "price",
      type: "number",
    },

    {
      label: "Form Factor",
      key: "formFactor",
      type: "category",
    },

    {
      label: "Color Theme",
      key: "color",
      type: "category",
    },

    {
      label: "Seller Platform",
      key: "seller",
      type: "category",
    },
  ];

  if (loading) {
    return <LoadingSpinner item="motherboards" />;
  }

  // =========================================================
  // PAGE
  // =========================================================
  return (
    <PartPickerLayout
      title="Motherboard"
      data={moboData}
      paramKey="motherboard"
      filterConfigs={moboFilterConfigs}

      // 🔥 CRITICAL FIX
      allCpuData={cpuData}
    />
  );
}