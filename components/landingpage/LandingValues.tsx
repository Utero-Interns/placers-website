import ValuesCard from "./ValuesCard";
import { MapPinned, SearchCheck, HandCoins } from "lucide-react";
import SectionTag from "./SectionTag";

export default function LandingValues() {
    return(
        <section id="values" className="flex flex-col items-center justify-center bg-[var(--color-primary)] w-full px-4 sm:px-6 lg:px-8 pt-8 mt-12 md:mt-16 lg:mt-20 2xl:mt-24">
            <div className="w-11/12">
                <SectionTag 
                    text="OUR VALUES"
                    bgColor="white"
                    textColor="var(--color-primary)"
                />
            </div>
            
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end w-11/12 mt-6 lg:mt-4 space-y-4 lg:space-y-0">
                <h1 className="text-white font-bold leading-tight lg:leading-snug
                               text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl
                               w-full lg:w-1/2 2xl:w-1/4">
                    Solusi Cerdas Placers
                </h1>

                <p className="w-full lg:w-1/2 2xl:w-1/3 
                              text-base sm:text-lg xl:text-xl 2xl:text-2xl">
                    Menghadirkan teknologi dan layanan inovatif untuk memudahkan dalam mencari, memesan, dan mengelola titik billboard di berbagai lokasi.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 w-11/12 mt-10 mb-12 md:mb-16 2xl:mb-20">
                <ValuesCard
                    icon={MapPinned}
                    title="Upload Lokasi Fleksibel"
                    description="Unggah titik billboard kapan saja dan di mana saja."
                />
                <ValuesCard
                    icon={SearchCheck}
                    title="Pencarian Akurat"
                    description="Temukan lokasi billboard sesuai target audiens Anda dengan teknologi pencarian pintar."
                />
                <ValuesCard
                    icon={HandCoins}
                    title="Hemat & Transparan"
                    description="Transaksi langsung dengan pemilik titik, tanpa perantara, membuat biaya lebih efisien."
                />
                <ValuesCard
                    icon={MapPinned}
                    title="Upload Lokasi Fleksibel"
                    description="Unggah titik billboard kapan saja dan di mana saja."
                />
                <ValuesCard
                    icon={SearchCheck}
                    title="Pencarian Akurat"
                    description="Temukan lokasi billboard sesuai target audiens Anda dengan teknologi pencarian pintar."
                />
                <ValuesCard
                    icon={HandCoins}
                    title="Hemat & Transparan"
                    description="Transaksi langsung dengan pemilik titik, tanpa perantara, membuat biaya lebih efisien."
                />
            </div>
        </section>
    );
}