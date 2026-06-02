"use client";

import { useEffect, useState } from "react";
import PartPickerLayout from "../partPickerLayout";
import LoadingSpinner from "../loadingSpinner";

export default function MotherboardPage() {
  const [mbData, setMbData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/motherboard.json")
      .then((res) => res.json())
      .then((data) => {
        setMbData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading motherboard.json:", err);
        setLoading(false);
      });
  }, []);

  const mbFilterConfigs = [
    { label: "Manufacturer", key: "manufacturer", type: "category" },
    { label: "Socket", key: "socket", type: "category" },
    { label: "Chipset", key: "chipset", type: "category" },
    { label: "Form Factor", key: "form_factor", type: "category" },
    { label: "RAM Type", key: "ram_type", type: "category" },
    { label: "Price ($)", key: "price", type: "number" },
  ];

  if (loading) return <LoadingSpinner item="motherboards" />;

  return (
    <PartPickerLayout
      title="Motherboard"
      data={mbData}
      paramKey="motherboard"
      filterConfigs={mbFilterConfigs}
    />
  );
}