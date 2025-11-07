import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await context.params;
    const filePath = pathSegments.join("/");

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
      headers: {
        "Content-Type": res.headers.get("content-type") || "image/jpeg",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
