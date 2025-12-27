import { NextResponse } from 'next/server';

export async function GET() {
    const EXTERNAL_API_URL = 'http://utero.viewdns.net:3100/billboard/recycle-bin';

    try {
        const response = await fetch(EXTERNAL_API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add any necessary authentication headers if the external API requires them
                // 'Authorization': `Bearer ${process.env.EXTERNAL_API_TOKEN}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ status: false, message: errorData.message || 'Failed to fetch recycled billboards from external API' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ status: true, data });
    } catch (error: unknown) {
        console.error('Error in proxy GET /billboard/recycle-bin:', error);
        const message = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({ status: false, message: message || 'Internal server error' }, { status: 500 });
    }
}
