import { Grid2X2, PanelLeftOpen, Rotate3D } from "lucide-react";
import BillboardCard from "../BillboardCard";
import SectionTag from "./SectionTag";

export default function LandingGallery() {
    return (
        <section 
            id="gallery" 
            className="flex items-center justify-center bg-white w-full px-4 sm:px-6 lg:px-8 mt-16 md:mt-24"
        >
            <div className="flex flex-col items-center space-y-2 md:space-y-3">
                <SectionTag 
                    text="OUR GALLERY"
                    bgColor="var(--color-primary)"
                    textColor="white"
                />

                <h1 className="text-black text-4xl sm:text-5xl lg:text-6xl font-bold text-center leading-tight">
                    Showcase Placers
                </h1>

                <p className="text-black text-lg sm:text-xl lg:text-2xl text-center max-w-3xl">
                    Jelajahi titik-titik billboard strategis terbaik dari Placers untuk mendukung promosi bisnis Anda.
                </p>

                {/* gallery cards container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pt-8 md:pt-10 w-11/12">

                <BillboardCard
                    image="/billboard1.png"
                    title="Perempatan Patimura Malang, Jawa Timur"
                    tags={[
                        { text: "4 x 8", Icon: Grid2X2 },
                        { text: "Landscape", Icon: Rotate3D },
                        { text: "Satu Sisi", Icon: PanelLeftOpen },
                    ]}
                    detailHref="/billboard/1"
                    sellerImage="/seller-logo1.png"
                    rating="4.8"
                    orders="(120)"
                    sellerName="Media Kreatif"
                    price="1.500.000"
                />

                <BillboardCard
                    image="/billboard2.png"
                    title="Jl. Soekarno Hatta, Malang"
                    tags={[
                        { text: "5 x 10", Icon: Grid2X2 },
                        { text: "Portrait", Icon: Rotate3D },
                        { text: "Dua Sisi", Icon: PanelLeftOpen },
                    ]}
                    detailHref="/billboard/2"
                    sellerImage="/seller-logo2.png"
                    rating="4.9"
                    orders="(215)"
                    sellerName="Citra Advertising"
                    price="2.800.000"
                />

                <BillboardCard
                    image="/billboard3.png"
                    title="Jl. Ijen, Malang"
                    tags={[
                        { text: "6 x 4", Icon: Grid2X2 },
                        { text: "Landscape", Icon: Rotate3D },
                        { text: "Satu Sisi", Icon: PanelLeftOpen },
                    ]}
                    detailHref="/billboard/3"
                    sellerImage="/seller-logo3.png"
                    rating="4.7"
                    orders="(88)"
                    sellerName="Promo Jaya"
                    price="1.200.000"
                />

                <BillboardCard
                    image="/billboard4.png"
                    title="Jl. Veteran, Malang"
                    tags={[
                        { text: "3 x 9", Icon: Grid2X2 },
                        { text: "Portrait", Icon: Rotate3D },
                        { text: "Dua Sisi", Icon: PanelLeftOpen },
                    ]}
                    detailHref="/billboard/4"
                    sellerImage="/seller-logo1.png"
                    rating="5.0"
                    orders="(310)"
                    sellerName="Media Kreatif"
                    price="2.100.000"
                />

                <BillboardCard
                    image="/billboard1.png"
                    title="Simpang Balapan, Malang"
                    tags={[
                        { text: "8 x 6", Icon: Grid2X2 },
                        { text: "Landscape", Icon: Rotate3D },
                        { text: "Satu Sisi", Icon: PanelLeftOpen },
                    ]}
                    detailHref="/billboard/5"
                    sellerImage="/seller-logo2.png"
                    rating="4.8"
                    orders="(154)"
                    sellerName="Citra Advertising"
                    price="2.500.000"
                />

                <BillboardCard
                    image="/billboard2.png"
                    title="Jl. Mayjen Panjaitan, Malang"
                    tags={[
                        { text: "7 x 7", Icon: Grid2X2 },
                        { text: "Square", Icon: Rotate3D },
                        { text: "Dua Sisi", Icon: PanelLeftOpen },
                    ]}
                    detailHref="/billboard/6"
                    sellerImage="/seller-logo3.png"
                    rating="4.9"
                    orders="(198)"
                    sellerName="Promo Jaya"
                    price="3.000.000"
                />

                <BillboardCard
                    image="/billboard3.png"
                    title="Jl. MT Haryono, Malang"
                    tags={[
                        { text: "6 x 3", Icon: Grid2X2 },
                        { text: "Landscape", Icon: Rotate3D },
                        { text: "Satu Sisi", Icon: PanelLeftOpen },
                    ]}
                    detailHref="/billboard/7"
                    sellerImage="/seller-logo1.png"
                    rating="4.6"
                    orders="(75)"
                    sellerName="Media Kreatif"
                    price="950.000"
                />

                <BillboardCard
                    image="/billboard4.png"
                    title="Jl. Ciliwung, Malang"
                    tags={[
                        { text: "5 x 5", Icon: Grid2X2 },
                        { text: "Square", Icon: Rotate3D },
                        { text: "Satu Sisi", Icon: PanelLeftOpen },
                    ]}
                    detailHref="/billboard/8"
                    sellerImage="/seller-logo2.png"
                    rating="5.0"
                    orders="(250)"
                    sellerName="Citra Advertising"
                    price="1.800.000"
                />    

                </div>
            </div>
        </section>
    );
}