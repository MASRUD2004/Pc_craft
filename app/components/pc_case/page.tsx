"use client";

import { useEffect, useState } from "react";
import PartPickerLayout from "../partPickerLayout";
import LoadingSpinner from "../loadingSpinner";

export default function PcCasePage() {
  const [caseData, setCaseData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/pc_case.json")
      .then((res) => res.json())
      .then((data) => {
        setCaseData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading case.json:", err);
        setLoading(false);
      });
  }, []);

  const caseFilterConfigs = [
    { label: "Manufacturer", key: "manufacturer", type: "category" },
    { label: "Form Factor", key: "form_factor", type: "category" },
    { label: "Color", key: "color", type: "category" },
    { label: "Side Panel", key: "side_panel", type: "category" },
    { label: "Max GPU Length (mm)", key: "max_gpu_length", type: "number" },
    { label: "Price ($)", key: "price", type: "number" },
  ];

  if (loading) return <LoadingSpinner item="PC cases" />;

  return (
    <PartPickerLayout
      title="Computer Case"
      data={caseData}
      paramKey="case"
      filterConfigs={caseFilterConfigs}
    />
  );
}