"use client";

import { useEffect, useState } from "react";
import PartPickerLayout from "../partPickerLayout";

export default function GpuPage() {
  const [gpuData, setGpuData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/gpu.json")
      .then((res) => res.json())
      .then((data) => {
        setGpuData(data); // \u2705 Fixed typo: uppercase 'G' matches useState definition
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading gpu.json:", err);
        setLoading(false);
      });
  }, []);

  const gpuFilterConfigs = [
    { label: "Manufacturer", key: "spec1", type: "category" },     
    { label: "Price", key: "price", type: "number" },              
    { label: "VRAM (GB)", key: "vram", type: "number" },           
    { label: "Clock Speed (MHz)", key: "clock", type: "number" },  
    { label: "Seller Platform", key: "seller", type: "category" }  
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center font-sans">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium">Loading graphics cards...</p>
        </div>
      </div>
    );
  }

  return (
    <PartPickerLayout 
      title="Graphics Card (GPU)" 
      data={gpuData} 
      paramKey="gpu" 
      filterConfigs={gpuFilterConfigs} 
    />
  );
}