// 

import type {
  Billboard,
  BillboardApiResponse,
  Owner,
  OwnerUser,
  BillboardImage,
  Category,
} from "@/types";


// ------------------------------------------------------
// 🟦 Dummy Base Types
// ------------------------------------------------------

// Owner User
const dummyOwnerUser: OwnerUser = {
  id: "user123",
  username: "dummyowner",
  email: "owner@example.com",
  phone: "081234567890",
  level: "owner",
  provider: "local",
  profilePicture: "/dummy/profile.jpg",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Owner
const dummyOwner: Owner = {
  id: "owner123",
  fullname: "John Doe",
  companyName: "Dummy Advertising Co.",
  user: dummyOwnerUser,
};

// Category
const dummyCategory: Category = {
  id: "cat123",
  name: "Premium Billboard",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Billboard Images
const dummyImages: BillboardImage[] = [
  {
    id: "img1",
    url: "/dummy/billboard1.jpg",
    type: "main",
    billboardId: "1",
    designId: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "img2",
    url: "/dummy/billboard1b.jpg",
    type: "side",
    billboardId: "1",
    designId: null,
    createdAt: new Date().toISOString(),
  },
];


// ------------------------------------------------------
// 🟩 Dummy Billboard List
// ------------------------------------------------------

const dummyBillboards: Billboard[] = [
  {
    id: "1",
    ownerId: "owner123",
    categoryId: "cat123",
    description: "High-visibility billboard located at a crowded intersection.",
    location: "Jl. Dummy Raya No. 1",
    cityId: "city001",
    provinceId: "prov001",
    cityName: "Kota Dummy",
    provinceName: "Provinsi Dummy",
    status: "available",
    mode: "rent",
    size: "12m x 5m",
    orientation: "Landscape",
    display: "Static",
    lighting: "LED",
    tax: "Included",
    landOwnership: "Owned",
    rentPrice: "5000000",
    sellPrice: null,
    servicePrice: "1000000",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDeleted: false,
    deletedAt: null,
    deletedById: null,
    view: 25,
    score: null,
    scoreAt: null,
    owner: dummyOwner,
    image: dummyImages,
    category: dummyCategory,
    averageRating: 4.3,
  },
  {
    id: "2",
    ownerId: "owner123",
    categoryId: "cat123",
    description: "Billboard near a commercial district with heavy traffic.",
    location: "Jl. Dummy Selatan No. 24",
    cityId: "city002",
    provinceId: "prov002",
    cityName: "Kota Selatan Dummy",
    provinceName: "Provinsi Selatan Dummy",
    status: "available",
    mode: "rent",
    size: "10m x 4m",
    orientation: "Portrait",
    display: "Digital",
    lighting: "Backlit",
    tax: "Excluded",
    landOwnership: "Leased",
    rentPrice: "3500000",
    sellPrice: null,
    servicePrice: "800000",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDeleted: false,
    deletedAt: null,
    deletedById: null,
    view: 15,
    score: null,
    scoreAt: null,
    owner: dummyOwner,
    image: dummyImages,
    category: dummyCategory,
    averageRating: 4.0,
  },
];


// ------------------------------------------------------
// 🟦 Dummy Fetch Functions
// ------------------------------------------------------

export const fetchBillboards = async (): Promise<Billboard[]> => {
  console.log("⚠️ Using DUMMY fetchBillboards() — API offline");

  await new Promise((r) => setTimeout(r, 300));

  return dummyBillboards;
};


export const fetchBillboardById = async (
  id: string
): Promise<BillboardApiResponse | null> => {
  console.log(`⚠️ Using DUMMY fetchBillboardById(${id}) — API offline`);

  await new Promise((r) => setTimeout(r, 300));

  const data = dummyBillboards.find((b) => b.id === id);
  if (!data) return null;

  return {
    status: true,
    message: "Dummy billboard detail (API offline)",
    data,
    averageRating: data.averageRating,
  };
};
