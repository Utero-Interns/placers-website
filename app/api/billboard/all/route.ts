import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billboard/all`);

    if (!res.ok) {
      console.warn("Failed to fetch billboards from backend, returning empty list.");
      return NextResponse.json({ data: [] });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in billboard proxy:", error);
    return NextResponse.json({ data: [] });
  }
}
