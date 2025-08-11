import ValuesCard from "./ValuesCard";
import { MapPinned, SearchCheck, HandCoins } from "lucide-react";
import SectionTag from "./SectionTag";

export default function LandingValues() {
    return(
        <section id="values" className="flex flex-col items-center justify-center bg-[var(--color-primary)] w-full pt-5 mt-24">
            <div className="flex justify-start w-11/12">
                <SectionTag 
                    text="OUR VALUES"
                    bgColor="white"
                    textColor="var(--color-primary)"
                />
            </div>
            

            <div className="flex justify-between items-end w-11/12 mt-4">
                <h1 className="text-white text-6xl font-bold w-1/4 leading-snug">
                    Solusi Cerdas Placers
                </h1>

                <p className="w-1/3 text-2xl">
                    Menghadirkan teknologi dan layanan inovatif untuk memudahkan dalam mencari, memesan, dan mengelola titik billboard di berbagai lokasi.
                </p>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-10 mb-20">
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