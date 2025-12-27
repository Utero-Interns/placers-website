import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { status: false, message: "Unauthorized: No access token found" },
      { status: 401 }
    );
  }

  try {
    // Note: User corrected endpoint to plural 'mybookmarks'
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmark/mybookmarks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
        return NextResponse.json(
            { status: false, message: data.message || `Failed to fetch bookmarks: ${res.status}` },
            { status: res.status }
        );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
