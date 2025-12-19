import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { status: false, message: "Unauthorized: No access token found" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
        return NextResponse.json(
            { status: false, message: data.message || `Failed to create transaction: ${res.statusText}` },
            { status: res.status }
        );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
