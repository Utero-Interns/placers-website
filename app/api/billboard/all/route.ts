import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters from the request (page, limit, city, categoryId, etc.)
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    
    // Build URL with query parameters if they exist
    const url = queryString 
      ? `${process.env.NEXT_PUBLIC_API_URL}/billboard/all?${queryString}`
      : `${process.env.NEXT_PUBLIC_API_URL}/billboard/all`;

    const res = await fetch(url, {
      cache: "no-store"
    });

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
