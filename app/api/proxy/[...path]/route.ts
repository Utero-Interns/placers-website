import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'http://utero.viewdns.net:3100';

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleProxy(request, await params);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleProxy(request, await params);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleProxy(request, await params);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleProxy(request, await params);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleProxy(request, await params);
}

async function handleProxy(request: NextRequest, params: { path: string[] }) {
    const path = params.path.join('/');
    const query = request.nextUrl.search;
    const targetUrl = `${API_URL}/${path}${query}`;

    console.log(`[Proxy] Forwarding ${request.method} request to: ${targetUrl}`);

    try {
        const headers = new Headers(request.headers);
        headers.delete('host');
        headers.delete('connection');

        // Ensure content-type is passed correctly, typically handled by fetch but good to be explicit if manipulating

        const body = (request.method !== 'GET' && request.method !== 'HEAD')
            ? request.body
            : undefined;

        const response = await fetch(targetUrl, {
            method: request.method,
            headers: headers,
            body: body,
            // crucial: do not let the backend follow redirects automatically if we want to pass them back?
            // usually fine to default.
            redirect: 'manual',
            // @ts-expect-error - duplex is required for streaming bodies in some environments (Node 18+)
            duplex: 'half'
        });

        const responseHeaders = new Headers(response.headers);

        // Fix Set-Cookie
        const setCookieHeader = responseHeaders.get('set-cookie');
        if (setCookieHeader) {
            // Check if we have multiple cookies (fetch API sometimes combines them with comma, but typically need raw access for multiple Set-Cookie)
            // NextJS NextResponse can handle multiple cookies if passed correctly.
            // However, Headers.get('set-cookie') might coalesce them. 
            // Better approach for Set-Cookie manipulation:

            // To properly handle multiple Set-Cookie headers in node/nextjs environment involves some caveats.
            // But let's verify if we simply strip the domain.

            // Note: response.headers may combine multiple Set-Cookie headers into one string separated by comma.
            // This is problematic for dates in cookies.
            // But usually for `connect.sid`, it's just one.

            const cookies = response.headers.getSetCookie(); // Available in newer Node/NextJS environments
            responseHeaders.delete('set-cookie');

            // Re-add them without domain
            const newResponse = new NextResponse(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: responseHeaders
            });

            cookies.forEach(cookie => {
                const fixedCookie = cookie.replace(/Domain=[^;]*;?\s?/gi, '');
                // Also optionally force Secure=false if localhost is http?
                // But generally removing Domain is enough.
                newResponse.headers.append('set-cookie', fixedCookie);
            });

            return newResponse;
        }

        return new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders
        });

    } catch (error) {
        console.error('[Proxy] Error:', error);
        return NextResponse.json({ error: 'Proxy Error' }, { status: 500 });
    }
}
