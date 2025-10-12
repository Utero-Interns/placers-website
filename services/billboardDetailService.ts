import type { BillboardApiResponse } from '../types';

const mockBillboards: BillboardApiResponse[] = [
  {
    billboard: {
      id: "0ee86b6a-7f12-4c60-a6e2-bfc9c07282ad",
      ownerId: "e03975ba-d959-4bac-bd8e-f6735e868593",
      categoryId: "889c3d68-a90a-4e8c-b875-b337bde72d37",
      description: "High traffic crossroad",
      location: "Perempatan Patimura",
      cityId: "f032c71c-bd91-4596-9360-8e24fa38e6a9",
      provinceId: "70f9eb09-c2bc-46d7-828f-fdcca64501b2",
      cityName: "Malang",
      provinceName: "Jawa Timur",
      status: "Rented",
      mode: "Rent",
      size: "4 x 8",
      orientation: "Horizontal",
      display: "Satu Sisi",
      lighting: "Backlite",
      tax: "PPN",
      landOwnership: "State",
      rentPrice: "150000000",
      sellPrice: null,
      servicePrice: "400000",
      createdAt: "2025-09-12T09:08:02.523Z",
      updatedAt: "2025-09-15T08:12:53.898Z",
      isDeleted: false,
      deletedAt: null,
      deletedById: null,
      view: 1,
      score: null,
      scoreAt: null,
      owner: {
        id: "e03975ba-d959-4bac-bd8e-f6735e868593",
        userId: "3ec520f5-af4f-4b18-a669-68c172095a8a",
        fullname: "PT Iklan Jaya",
        companyName: "Merchant XX",
        ktp: "3173XXXXXXXXXXXX",
        npwp: "01.234.567.8-999.000",
        ktpAddress: "Jl. Mawar No. 1, Jakarta",
        officeAddress: "Jl. Melati No. 10, Jakarta",
        createdAt: "2025-09-12T09:08:02.246Z",
        updatedAt: "2025-09-12T09:08:02.246Z"
      },
      image: [
        {
          id: "267509e2-b891-4900-9ab1-eb7200edfb93",
          url: "https://images.unsplash.com/photo-1520208422220-d12a9648a7c2?q=80&w=2532&auto=format&fit=crop",
          type: "billboard",
          billboardId: "0ee86b6a-7f12-4c60-a6e2-bfc9c07282ad",
          designId: null,
          createdAt: "2025-09-12T09:08:02.572Z"
        }
      ],
      category: {
        id: "889c3d68-a90a-4e8c-b875-b337bde72d37",
        name: "BILLBOARD",
        createdAt: "2025-09-12T09:08:00.651Z",
        updatedAt: "2025-09-12T09:08:00.651Z"
      }
    },
    averageRating: 4.8,
    additionalInfo: "Layanan ini mencakup gratis penggantian visual untuk pemasangan pertama dan gratis sewa selama 1 bulan untuk kontrak sewa 12 bulan. Harga tidak termasuk pajak bulanan, dan penggantian visual setelah pemasangan pertama akan dikenakan biaya tambahan.",
    reviews: [
      {
        id: 1,
        author: 'Test',
        date: '6 Agustus 2025',
        rating: 4.0,
        comment: 'Lokasi titik strategis dan sangat mempengaruhi.',
        avatarUrl: 'https://i.pravatar.cc/40?u=a042581f4e29026704d',
      },
      {
        id: 2,
        author: 'Test',
        date: '6 Agustus 2025',
        rating: 4.0,
        comment: 'Lokasi titik strategis dan sangat mempengaruhi.',
        avatarUrl: 'https://i.pravatar.cc/40?u=a042581f4e29026705d',
      },
    ]
  },
  {
    billboard: {
      id: "1ab23c4d-5678-90ef-ghij-klmno1234567",
      ownerId: "e03975ba-d959-4bac-bd8e-f6735e868593",
      categoryId: "889c3d68-a90a-4e8c-b875-b337bde72d37",
      description: "Digital screen in city center",
      location: "Alun-Alun Kota",
      cityId: "f032c71c-bd91-4596-9360-8e24fa38e6a9",
      provinceId: "70f9eb09-c2bc-46d7-828f-fdcca64501b2",
      cityName: "Bandung",
      provinceName: "Jawa Barat",
      status: "Available",
      mode: "Rent",
      size: "5 x 10",
      orientation: "Vertical",
      display: "Dua Sisi",
      lighting: "LED",
      tax: "PPN",
      landOwnership: "Private",
      rentPrice: "250000000",
      sellPrice: null,
      servicePrice: "500000",
      createdAt: "2025-10-01T11:20:15.123Z",
      updatedAt: "2025-10-01T11:20:15.123Z",
      isDeleted: false,
      deletedAt: null,
      deletedById: null,
      view: 1,
      score: null,
      scoreAt: null,
      owner: {
        id: "e03975ba-d959-4bac-bd8e-f6735e868593",
        userId: "3ec520f5-af4f-4b18-a669-68c172095a8a",
        fullname: "PT Media Kreatif",
        companyName: "Media Kreatif",
        ktp: "3173XXXXXXXXXXXX",
        npwp: "01.234.567.8-999.000",
        ktpAddress: "Jl. Mawar No. 1, Jakarta",
        officeAddress: "Jl. Melati No. 10, Jakarta",
        createdAt: "2025-09-12T09:08:02.246Z",
        updatedAt: "2025-09-12T09:08:02.246Z"
      },
      image: [
        {
          id: "3ad418f7-c524-4b5a-9d3c-a11bde0434b2",
          url: "https://images.unsplash.com/photo-1549925243-75b41b44eb12?q=80&w=2670&auto=format&fit=crop",
          type: "billboard",
          billboardId: "1ab23c4d-5678-90ef-ghij-klmno1234567",
          designId: null,
          createdAt: "2025-10-01T11:20:15.123Z"
        }
      ],
      category: {
        id: "889c3d68-a90a-4e8c-b875-b337bde72d37",
        name: "VIDEOTRON",
        createdAt: "2025-09-12T09:08:00.651Z",
        updatedAt: "2025-09-12T09:08:00.651Z"
      }
    },
    averageRating: 4.9,
    additionalInfo: "Layar digital dengan resolusi tinggi. Cocok untuk kampanye video. Termasuk pembaruan konten mingguan tanpa biaya tambahan.",
    reviews: [
      {
        id: 1,
        author: 'User Keren',
        date: '12 September 2025',
        rating: 5.0,
        comment: 'Kualitas gambarnya luar biasa, sangat eye-catching!',
        avatarUrl: 'https://i.pravatar.cc/40?u=b042581f4e29026704d',
      }
    ]
  }
];

export const fetchBillboardData = (id: string): Promise<BillboardApiResponse | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = mockBillboards.find(b => b.billboard.id === id);
      resolve(data);
    }, 500); // Simulate network delay
  });
};