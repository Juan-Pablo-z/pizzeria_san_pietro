"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export const useSearchParams = (defaultFilters: any) => {
  const router = useRouter();

  const [filters, setFilters] = useState(defaultFilters);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (newPage: number) => {
    handleApplyFiltersWithPage(newPage);
  };

  const handleApplyFiltersWithPage = (page: number = 1) => {
    const queries = new URLSearchParams();
    queries.set("page", page + "");
    Object.entries(filters).forEach(([key, value]: any[]) => {
      if (!value) return;
      if (key === "fktc_fac" && value === "all") return;
      queries.set(key, value);
    });
    router.push("?" + queries.toString());
  };

  const handleApplyFilters = () => {
    const queries = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]: any[]) => {
      if (!value) return;
      queries.set(key, value);
    });
    router.push("?" + queries.toString());
  };

  return {
    filters,
    handleFilterChange,
    handlePageChange,
    handleApplyFilters,
    handleApplyFiltersWithPage,
  };
};
