"use client";

import { useEffect, useState } from "react";
import PartPickerLayout from "../partPickerLayout";
import LoadingSpinner from "../loadingSpinner";

export default function CpuCoolerPage() {
  const [coolerData, setCoolerData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/cpu_cooler.json")
      .then((res) => res.json())
      .then((data) => {
        setCoolerData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading cooler.json:", err);
        setLoading(false);
      });
  }, []);

  const coolerFilterConfigs = [
    { label: "Brand", key: "spec1", type: "category" },          // Corsair, LIAN LI, Deepcool
    { label: "Cooler Type", key: "spec2", type: "category" },   // Air Cooler, 240mm AIO, 360mm AIO
    { label: "Price ($)", key: "price", type: "number" },
    { label: "Fan Size (mm)", key: "fanSize", type: "number" },  // 120, 140
    { label: "Color", key: "color", type: "category" },          // Black, White/Snow
    { label: "Seller Platform", key: "seller", type: "category" }
  ];

  if (loading) return <LoadingSpinner item="CPU coolers" />;

  return <PartPickerLayout title="CPU Cooler" data={coolerData} paramKey="cooler" filterConfigs={coolerFilterConfigs} />;
}