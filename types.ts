
import { FC, SVGProps } from 'react';

export interface BillboardTag {
    text: string;
    Icon: FC<SVGProps<SVGSVGElement>>;
}

export interface Billboard {
    id: number;
    image: string;
    title: string;
    tags: BillboardTag[];
    sellerImage: string;
    rating: string;
    orders: string;
    sellerName: string;
    price: string;
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
