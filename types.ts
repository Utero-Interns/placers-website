// Used for billboard cards / listings
export interface Billboard {
    id: number;
    image: string;
    type: string;
    title: string;
    size: string;
    orientation: string;
    sides: string;
    rating: string;
    orders: string;
    price: string;
    sellerImage: string;
    sellerName: string;
    detailHref: string;
}

// Used for bookmarked billboards
export interface Bookmark {
  id: string;
  merchant: string;
  type: string;
  location: string;
  size: string;
  orientation: string;
  sides: string;
  rating: number;
  price: string;
  imageUrl: string;
  avatarUrl: string;
  statusAvailable: boolean;
}

// Used for user profile
export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

export interface PasswordData {
  oldPassword?: string;
  newPassword?: string;
}
