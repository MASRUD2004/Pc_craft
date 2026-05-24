"use client";

import { useEffect, useState } from "react";
import PartPickerLayout from "../partPickerLayout";
import LoadingSpinner from "../loadingSpinner";

export default function RamPage() {
  const [ramData, setRamData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/ram.json")
      .then((res) => res.json())
      .then((data) => {
        setRamData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading ram.json:", err);
        setLoading(false);
      });
  }, []);

  const ramFilterConfigs = [
    { label: "Brand", key: "spec1", type: "category" },        // G.Skill, Corsair, TeamGroup
    { label: "Memory Type", key: "spec2", type: "category" },  // DDR4, DDR5
    { label: "Price ($)", key: "price", type: "number" },
    { label: "Total Capacity (GB)", key: "capacity", type: "number" }, // 16, 32, 64
    { label: "Speed (MHz)", key: "speed", type: "number" },     // 3600, 5600, 6000
    { label: "Color", key: "color", type: "category" }
  ];

  if (loading) return <LoadingSpinner item="RAM modules" />;

  // CRITICAL FIX: Changed paramKey from "ram" to "memory"
  return (
    <PartPickerLayout 
      title="Memory (RAM)" 
      data={ramData} 
      paramKey="memory" 
      filterConfigs={ramFilterConfigs} 
    />
  );
}