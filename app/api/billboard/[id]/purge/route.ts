import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const EXTERNAL_API_URL = `http://utero.viewdns.net:3100/billboard/${id}/purge?confirm=true`;

    try {
        const response = await fetch(EXTERNAL_API_URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // Add any necessary authentication headers if the external API requires them
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ status: false, message: errorData.message || `Failed to purge billboard ${id}` }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ status: true, data });
    } catch (error: unknown) {
        console.error(`Error in proxy DELETE /billboard/${id}/purge:`, error);
        const message = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({ status: false, message: message || 'Internal server error' }, { status: 500 });
    }
}
