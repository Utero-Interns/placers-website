"use client";

import { Billboard } from "@/types";
import dynamic from "next/dynamic";

// Dynamically load the real map component with SSR disabled
const LeafletMap = dynamic(() => import("./_LeafletMap"), {
  ssr: false,
});

export default function SimpleMap({ billboards }: { billboards: Billboard[] }) {
  return <LeafletMap billboards={billboards} />;
}
