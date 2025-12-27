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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-on`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Forward the token
      },
    });

    if (!res.ok) {
        return NextResponse.json(
            { status: false, message: `Failed to fetch add-ons: ${res.statusText}` },
            { status: res.status }
        );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching add-ons:", error);
    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
