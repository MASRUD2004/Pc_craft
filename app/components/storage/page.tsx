"use client";

import { useEffect, useState } from "react";
import PartPickerLayout from "../partPickerLayout";
import LoadingSpinner from "../loadingSpinner";

export default function StoragePage() {
  const [storageData, setStorageData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/storage.json")
      .then((res) => res.json())
      .then((data) => {
        setStorageData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading storage.json:", err);
        setLoading(false);
      });
  }, []);

  const storageFilterConfigs = [
    { label: "Brand", key: "spec1", type: "category" },        // Samsung, Western Digital, Crucial
    { label: "Interface Form", key: "spec2", type: "category" }, // M.2 NVMe, 2.5" SATA
    { label: "Price ($)", key: "price", type: "number" },
    { label: "Capacity (GB)", key: "capacity", type: "number" }, // 500, 1000, 2000
    { label: "Seller Platform", key: "seller", type: "category" }
  ];

  if (loading) return <LoadingSpinner item="storage drives" />;

  return <PartPickerLayout title="Storage Drive" data={storageData} paramKey="storage" filterConfigs={storageFilterConfigs} />;
}