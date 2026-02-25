import type { Billboard } from "@/types";

export const fetchBillboards = async (queryParams?: string): Promise<Billboard[]> => {
  try {
    console.log("Fetching billboards from API...");
    const url = queryParams ? `/api/billboard/all?${queryParams}` : "/api/billboard/all";
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch billboards: ${res.status}`);
    }

    const json = await res.json();
    console.log("...data received.", json);

    const billboards: Billboard[] = json.data || [];

    return billboards;
  } catch (error) {
    console.error("Error fetching billboards:", error);
    return [];
  }
};

import type { BillboardDetailApiResponse } from "@/types";

export async function fetchBillboardById(id: string): Promise<BillboardDetailApiResponse | null> {
  try {
    const res = await fetch(`/api/billboard/${id}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return (await res.json()) as BillboardDetailApiResponse; 
  } catch (error) {
    console.error("Error fetching billboard:", error);
    return null;
  }
}
