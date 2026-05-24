"use client";

import { useEffect, useState } from "react";
import PartPickerLayout from "../partPickerLayout";
import LoadingSpinner from "../loadingSpinner";

export default function PowerSupplyPage() {
  const [psuData, setPsuData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/powerSupply.json")
      .then((res) => res.json())
      .then((data) => {
        setPsuData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading psu.json:", err);
        setLoading(false);
      });
  }, []);

  const psuFilterConfigs = [
    { label: "Brand", key: "spec1", type: "category" },        // Corsair, Seasonic, ASUS
    { label: "Efficiency Rating", key: "spec2", type: "category" }, // 80+ Gold, 80+ Platinum
    { label: "Price ($)", key: "price", type: "number" },
    { label: "Wattage (W)", key: "wattage", type: "number" },   // 650, 750, 850, 1000
    { label: "Modular Type", key: "modular", type: "category" }, // Full, Semi, Non-Modular
    { label: "Color", key: "color", type: "category" }
  ];

  if (loading) return <LoadingSpinner item="power supplies" />;

  return <PartPickerLayout title="Power Supply (PSU)" data={psuData} paramKey="psu" filterConfigs={psuFilterConfigs} />;
}