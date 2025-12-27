import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const queryString = searchParams.toString();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const authHeader = req.headers.get('Authorization');
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  // Also forward cookie if present, as some auth flows use cookies
  const cookieHeader = req.headers.get('cookie');
  if (cookieHeader) {
      headers['cookie'] = cookieHeader;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history?${queryString}`, {
      headers,
    });

    const data = await res.json();
    
    // Forward the status code from the backend
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
