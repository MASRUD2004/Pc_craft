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
    { label: "Brand", key: "spec1", type: "category" },        // LIAN LI, NZXT, Montech
    { label: "Form Factor Support", key: "spec2", type: "category" }, // ATX Mid Tower, Mini-ITX
    { label: "Price ($)", key: "price", type: "number" },
    { label: "Color Theme", key: "color", type: "category" },  // Black, White, Snow White
    { label: "Max GPU Length (mm)", key: "gpuLengthMax", type: "number" },
    { label: "Seller Platform", key: "seller", type: "category" }
  ];

  if (loading) return <LoadingSpinner item="PC cases" />;

  return <PartPickerLayout title="Computer Case" data={caseData} paramKey="case" filterConfigs={caseFilterConfigs} />;
}