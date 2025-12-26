import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ billboardId: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const { billboardId } = await params;

  if (!token) {
    return NextResponse.json(
      { status: false, message: "Unauthorized: No access token found" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmark/${billboardId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
        return NextResponse.json(
            { status: false, message: data.message || `Failed to add bookmark: ${res.status}` },
            { status: res.status }
        );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error adding bookmark:", error);
    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ billboardId: string }> }
  ) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    const { billboardId } = await params;
  
    if (!token) {
      return NextResponse.json(
        { status: false, message: "Unauthorized: No access token found" },
        { status: 401 }
      );
    }
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmark/${billboardId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });
  
      const data = await res.json();
  
      if (!res.ok) {
          return NextResponse.json(
              { status: false, message: data.message || `Failed to remove bookmark: ${res.status}` },
              { status: res.status }
          );
      }
  
      return NextResponse.json(data);
    } catch (error) {
      console.error("Error removing bookmark:", error);
      return NextResponse.json(
        { status: false, message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
