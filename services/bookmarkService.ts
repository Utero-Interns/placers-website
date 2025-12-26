import type { Bookmark } from '../types';

export const fetchBookmarks = async (): Promise<Bookmark[]> => {
  try {
    const res = await fetch("/api/bookmark/mybookmarks", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch bookmarks: ${res.status}`);
    }

    const json = await res.json();
    const data = json.data || [];

    // Map backend response to Bookmark type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bookmarks: Bookmark[] = data.map((item: any) => ({
      id: item.billboard.id,
      merchant: item.billboard.owner.companyName || item.billboard.owner.fullname,
      type: item.billboard.category.name,
      location: item.billboard.location, // Could combine with city/province if needed
      size: item.billboard.size,
      orientation: item.billboard.orientation,
      sides: item.billboard.display,
      rating: item.billboard.score || 0, // Score might be null
      price: item.billboard.rentPrice || item.billboard.sellPrice || 'Hubungi Admin',
      imageUrl: item.billboard.image?.length > 0
        ? `/api/uploads/${item.billboard.image[0].url.replace(/^uploads\//, "")}`
        : '/billboard-placeholder.png',
      avatarUrl: item.billboard.owner?.user?.profilePicture
        ? `/api/uploads/${item.billboard.owner.user.profilePicture.replace(/^uploads\//, "")}`
        : '/seller-placeholder.png',
      statusAvailable: item.billboard.status === 'Available',
    }));

    return bookmarks;
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
};

export const addBookmark = async (billboardId: string): Promise<boolean> => {
  try {
    const res = await fetch(`/api/bookmark/${billboardId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return false;
    const json = await res.json();
    return json.status;
  } catch (error) {
    console.error("Error adding bookmark:", error);
    return false;
  }
};

export const removeBookmark = async (billboardId: string): Promise<boolean> => {
  try {
    const res = await fetch(`/api/bookmark/${billboardId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return false;
    const json = await res.json();
    return json.status;
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return false;
  }
};