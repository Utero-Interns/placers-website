
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
