/**
 * Standardizes image URLs by prepending the base URL if needed.
 * Handles null/undefined by returning a placeholder.
 * 
 * @param path - The image path or URL from the API
 * @returns A fully qualified image URL string
 */
export const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return 'https://placehold.co/600x400?text=No+Image';

    // If it's the backend URL, replace with proxy
    if (path.startsWith('http://utero.viewdns.net:3100')) {
        const url = new URL(path);
        return `/api/proxy${url.pathname}`;
    }

    // If it's another external URL (e.g. Google Auth), return as is
    if (path.startsWith('http')) return path;

    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // Use the proxy to avoid CORS issues with images
    return `/api/proxy/${cleanPath}`;
};
