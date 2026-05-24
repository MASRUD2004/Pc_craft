"use client";

import { useEffect, useState } from "react";
import PartPickerLayout from "../partPickerLayout";
import LoadingSpinner from "../loadingSpinner";

export default function MotherboardPage() {
  const [moboData, setMoboData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/motherboard.json")
      .then((res) => res.json())
      .then((data) => {
        setMoboData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading motherboard.json:", err);
        setLoading(false);
      });
  }, []);

  const moboFilterConfigs = [
    { label: "Manufacturer", key: "spec1", type: "category" },  // ASUS, MSI, Gigabyte
    { label: "Socket & Chipset", key: "spec2", type: "category" }, // AM5 B650, LGA1700 Z790
    { label: "Price ($)", key: "price", type: "number" },
    { label: "Form Factor", key: "formFactor", type: "category" }, // ATX, Micro-ATX, Mini-ITX
    { label: "Color Theme", key: "color", type: "category" },      // Black, White/Silver
    { label: "Seller Platform", key: "seller", type: "category" }
  ];

  if (loading) return <LoadingSpinner item="motherboards" />;

  return <PartPickerLayout title="Motherboard" data={moboData} paramKey="motherboard" filterConfigs={moboFilterConfigs} />;
}