import { Grid2X2, PanelLeftOpen, Rotate3D } from "lucide-react";
import BillboardCard from "../BillboardCard";
import SectionTag from "./SectionTag";

export default function LandingGallery() {
    return (
        <section id="gallery" className="flex items-center justify-center bg-white w-full mt-24">
            <div className="flex flex-col items-center space-y-1">
                <SectionTag 
                    text="OUR GALLERY"
                    bgColor="var(--color-primary)"
                    textColor="white"
                />

                <h1 className="text-black text-6xl font-bold text-center leading-normal">
                    Showcase Placers
                </h1>

                <p className="text-black text-2xl text-center">
                    Jelajahi titik-titik billboard strategis terbaik dari Placers untuk mendukung promosi bisnis Anda.
                </p>

                {/* gallery cards container */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-9">

                    <BillboardCard
                        image="/billboard1.png"
                        status="Tersedia"
                        title="Perempatan Patimura Malang, Jawa Timur"
                        tags={[
                        { text: "4 x 8", Icon: Grid2X2 },
                        { text: "Landscape", Icon: Rotate3D },
                        { text: "Satu Sisi", Icon: PanelLeftOpen },
                        ]}
                        detailHref="/billboard/1"
                    />

                    <BillboardCard
                        image="/billboard2.png"
                        status="Tidak Tersedia"
                        title="Jl. Soekarno Hatta, Malang"
                        tags={[
                        { text: "5 x 10", Icon: Grid2X2 },
                        { text: "Portrait", Icon: Rotate3D },
                        { text: "Dua Sisi", Icon: PanelLeftOpen },
                        ]}
                        detailHref="/billboard/2"
                    />

                    <BillboardCard
                        image="/billboard3.png"
                        status="Tersedia"
                        title="Jl. Ijen, Malang"
                        tags={[
                        { text: "6 x 4", Icon: Grid2X2 },
                        { text: "Landscape", Icon: Rotate3D },
                        { text: "Satu Sisi", Icon: PanelLeftOpen },
                        ]}
                        detailHref="/billboard/3"
                    />

                    <BillboardCard
                        image="/billboard4.png"
                        status="Tersedia"
                        title="Jl. Veteran, Malang"
                        tags={[
                        { text: "3 x 9", Icon: Grid2X2 },
                        { text: "Portrait", Icon: Rotate3D },
                        { text: "Dua Sisi", Icon: PanelLeftOpen },
                        ]}
                        detailHref="/billboard/4"
                    />

                    <BillboardCard
                        image="/billboard1.png"
                        status="Tidak Tersedia"
                        title="Simpang Balapan, Malang"
                        tags={[
                        { text: "8 x 6", Icon: Grid2X2 },
                        { text: "Landscape", Icon: Rotate3D },
                        { text: "Satu Sisi", Icon: PanelLeftOpen },
                        ]}
                        detailHref="/billboard/5"
                    />

                    <BillboardCard
                        image="/billboard2.png"
                        status="Tersedia"
                        title="Jl. Mayjen Panjaitan, Malang"
                        tags={[
                        { text: "7 x 7", Icon: Grid2X2 },
                        { text: "Square", Icon: Rotate3D },
                        { text: "Dua Sisi", Icon: PanelLeftOpen },
                        ]}
                        detailHref="/billboard/6"
                    />

                    <BillboardCard
                        image="/billboard3.png"
                        status="Tersedia"
                        title="Jl. MT Haryono, Malang"
                        tags={[
                        { text: "6 x 3", Icon: Grid2X2 },
                        { text: "Landscape", Icon: Rotate3D },
                        { text: "Satu Sisi", Icon: PanelLeftOpen },
                        ]}
                        detailHref="/billboard/7"
                    />

                    <BillboardCard
                        image="/billboard4.png"
                        status="Tidak Tersedia"
                        title="Jl. Ciliwung, Malang"
                        tags={[
                        { text: "5 x 5", Icon: Grid2X2 },
                        { text: "Square", Icon: Rotate3D },
                        { text: "Satu Sisi", Icon: PanelLeftOpen },
                        ]}
                        detailHref="/billboard/8"
                    />

                </div>
            </div>
        </section>
    );
}