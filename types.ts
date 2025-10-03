import type React from 'react';

export interface Specification {
  label: string;
  value: string;
  icon: React.ElementType;
}

// NEW TYPES based on API response
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

export interface BillboardCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
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
}

// export interface Review {
//   id: number;
//   avatarUrl: string;
//   author: string;
//   date: string;
//   rating: number;
//   comment: string;
// }

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





// billboard/detail response
export interface BillboardDetailApiResponse {
  data: BillboardDetail;
  averageRating: number; 
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

export interface Owner {
  id: string;
  fullname: string;
  companyName: string;
  user: OwnerUser;
}

export interface OwnerUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  level: string;
  provider: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillboardImage {
  id: string;
  url: string;
  type: string;
  billboardId: string;
  designId: string | null;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface City {
  id: string;
  name: string;
  provinceId: string;
  province: Province;
}

export interface Province {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  buyerId: string;
  sellerId: string;
  billboardId: string;
  designId: string;
  payment: string;
  status: string;
  totalPrice: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  rating?: Rating; 
}

export interface Rating {
  id: string;
  transactionId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  user: UserRating;
}

export interface UserRating {
  id: string;
  username: string;
  profilePicture: string;
}

// end of billboard/detail