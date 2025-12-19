import type { BillboardCategory, Category } from './category';
import type { City } from './location';
import type { Transaction } from './transaction';
import type { OwnerUser } from './user';

export interface BillboardOwner {
  id: string;
  userId: string;
  fullname: string;
  companyName: string;
  ktp: string;
  npwp: string;
  ktpAddress: string;
  officeAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillboardImageFile {
  id: string;
  url: string;
  type: string;
  billboardId: string;
  designId: string | null;
  createdAt: string;
}

export interface Owner {
  id: string;
  fullname: string;
  companyName: string;
  user: OwnerUser;
}

// Used for billboard cards / listings
export interface Billboard {
  id: string;
  ownerId: string;
  categoryId: string;
  description: string;
  location: string;
  cityId: string;
  provinceId: string;
  cityName: string;
  provinceName: string;
  status: string;
  mode: string;
  size: string;
  orientation: string;
  display: string;
  lighting: string;
  tax: string;
  landOwnership: string;
  rentPrice: string;
  sellPrice: string | null;
  servicePrice: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedById: string | null;
  view: number;
  score: number | null;
  scoreAt: string | null;
  owner: Owner;
  image: BillboardImageFile[];
  category: BillboardCategory;
  averageRating: number;
  latitude: number;
  longitude: number;
}

export interface BillboardApiResponse {
  status: boolean;
  message: string;
  data: Billboard;
  averageRating: number;
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

export interface BillboardImage {
  id: string;
  url: string;
  type: string;
  billboardId: string;
  designId: string | null;
  createdAt: string;
}

export interface BillboardDetail {
  id: string;
  ownerId: string;
  categoryId: string;
  description: string | null;
  location: string;
  cityId: string;
  provinceId: string;
  cityName: string;
  provinceName: string;
  status: "Available" | "Unavailable" | string;
  mode: "Rent" | "Sell" | string;
  size: string;
  orientation: string;
  display: string;
  lighting: string;
  tax: string;
  landOwnership: string;
  rentPrice: string;
  sellPrice: string | null;
  servicePrice: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedById: string | null;
  view: number;
  score: number;
  scoreAt: string;

  owner: Owner;
  image: BillboardImage[];
  category: Category;
  city: City;
  transaction: Transaction[];
}

export interface BillboardDetailApiResponse {
  data: BillboardDetail;
  averageRating: number; 
}
