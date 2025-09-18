import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> } 
) {
  try {
    const { path } = await context.params; 
    const filePath = path.join("/");

    const targetUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${filePath}`;

    const res = await fetch(targetUrl);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch file" },
        { status: res.status }
      );
    }

    const blob = await res.blob();
    return new Response(blob, {
      headers: { "Content-Type": res.headers.get("content-type") || "image/jpeg" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
