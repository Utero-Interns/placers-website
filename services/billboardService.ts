
import { Billboard } from '../types';
import { Grid2X2Icon, Rotate3DIcon, PanelLeftOpenIcon } from 'lucide-react';

const mockBillboards: Billboard[] = [
    {
        id: 1,
        image: "https://picsum.photos/seed/billboard1/600/400",
        title: "Perempatan Patimura Malang, Jawa Timur",
        tags: [
            { text: "4 x 8", Icon: Grid2X2Icon },
            { text: "Landscape", Icon: Rotate3DIcon },
            { text: "Satu Sisi", Icon: PanelLeftOpenIcon },
        ],
        sellerImage: "https://picsum.photos/seed/seller1/100/100",
        rating: "4.8",
        orders: "(120)",
        sellerName: "Media Kreatif",
        price: "1.500.000"
    },
    {
        id: 2,
        image: "https://picsum.photos/seed/billboard2/600/400",
        title: "Jl. Soekarno Hatta, Malang",
        tags: [
            { text: "5 x 10", Icon: Grid2X2Icon },
            { text: "Portrait", Icon: Rotate3DIcon },
            { text: "Dua Sisi", Icon: PanelLeftOpenIcon },
        ],
        sellerImage: "https://picsum.photos/seed/seller2/100/100",
        rating: "4.9",
        orders: "(215)",
        sellerName: "Citra Advertising",
        price: "2.800.000"
    },
    {
        id: 3,
        image: "https://picsum.photos/seed/billboard3/600/400",
        title: "Jl. Ijen, Malang",
        tags: [
            { text: "6 x 4", Icon: Grid2X2Icon },
            { text: "Landscape", Icon: Rotate3DIcon },
            { text: "Satu Sisi", Icon: PanelLeftOpenIcon },
        ],
        sellerImage: "https://picsum.photos/seed/seller3/100/100",
        rating: "4.7",
        orders: "(88)",
        sellerName: "Promo Jaya",
        price: "1.200.000"
    },
    {
        id: 4,
        image: "https://picsum.photos/seed/billboard4/600/400",
        title: "Jl. Veteran, Malang",
        tags: [
            { text: "3 x 9", Icon: Grid2X2Icon },
            { text: "Portrait", Icon: Rotate3DIcon },
            { text: "Dua Sisi", Icon: PanelLeftOpenIcon },
        ],
        sellerImage: "https://picsum.photos/seed/seller1/100/100",
        rating: "5.0",
        orders: "(310)",
        sellerName: "Media Kreatif",
        price: "2.100.000"
    },
    {
        id: 5,
        image: "https://picsum.photos/seed/billboard5/600/400",
        title: "Simpang Balapan, Malang",
        tags: [
            { text: "8 x 6", Icon: Grid2X2Icon },
            { text: "Landscape", Icon: Rotate3DIcon },
            { text: "Satu Sisi", Icon: PanelLeftOpenIcon },
        ],
        sellerImage: "https://picsum.photos/seed/seller2/100/100",
        rating: "4.8",
        orders: "(154)",
        sellerName: "Citra Advertising",
        price: "2.500.000"
    },
    {
        id: 6,
        image: "https://picsum.photos/seed/billboard6/600/400",
        title: "Jl. Mayjen Panjaitan, Malang",
        tags: [
            { text: "7 x 7", Icon: Grid2X2Icon },
            { text: "Square", Icon: Rotate3DIcon },
            { text: "Dua Sisi", Icon: PanelLeftOpenIcon },
        ],
        sellerImage: "https://picsum.photos/seed/seller3/100/100",
        rating: "4.9",
        orders: "(198)",
        sellerName: "Promo Jaya",
        price: "3.000.000"
    },
    {
        id: 7,
        image: "https://picsum.photos/seed/billboard7/600/400",
        title: "Jl. MT Haryono, Malang",
        tags: [
            { text: "6 x 3", Icon: Grid2X2Icon },
            { text: "Landscape", Icon: Rotate3DIcon },
            { text: "Satu Sisi", Icon: PanelLeftOpenIcon },
        ],
        sellerImage: "https://picsum.photos/seed/seller1/100/100",
        rating: "4.6",
        orders: "(75)",
        sellerName: "Media Kreatif",
        price: "950.000"
    },
    {
        id: 8,
        image: "https://picsum.photos/seed/billboard8/600/400",
        title: "Jl. Ciliwung, Malang",
        tags: [
            { text: "5 x 5", Icon: Grid2X2Icon },
            { text: "Square", Icon: Rotate3DIcon },
            { text: "Satu Sisi", Icon: PanelLeftOpenIcon },
        ],
        sellerImage: "https://picsum.photos/seed/seller2/100/100",
        rating: "5.0",
        orders: "(250)",
        sellerName: "Citra Advertising",
        price: "1.800.000"
    }
];

export const fetchBillboards = (): Promise<Billboard[]> => {
    console.log("Fetching billboards from mock API...");
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("...data received.");
            resolve(mockBillboards);
        }, 1500); // Simulate network delay
    });
};
