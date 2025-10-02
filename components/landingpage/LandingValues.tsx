import ValuesCard from "./ValuesCard";
import {
  MapPinned,
  SearchCheck,
  HandCoins,
  Monitor,
  TvMinimalPlay,
  MonitorSmartphone,
} from "lucide-react";
import SectionTag from "./SectionTag";

export default function LandingValues() {
  return (
    <section
      id="values"
      className="flex flex-col items-center justify-center 
                 bg-[var(--color-primary)] w-full 
                 px-6 md:px-12 2xl:px-20 
                 mt-10 md:mt-14 lg:mt-16 2xl:mt-20 
                 py-14 md:py-18 lg:py-20"
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Tag */}
        <SectionTag
          text="OUR VALUES"
          bgColor="white"
          textColor="var(--color-primary)"
        />

        {/* Heading & Description */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end 
                        mt-8 lg:mt-10 space-y-4 lg:space-y-0">
          <h1
            className="text-white font-bold leading-tight lg:leading-snug
                       text-4xl sm:text-4xl lg:text-5xl 2xl:text-6xl
                       w-full lg:w-1/2 2xl:w-1/3"
          >
            Solusi Cerdas <br /> Placers
          </h1>

          <p
            className="w-full lg:w-1/2 2xl:w-1/3 
                       text-base text-white leading-relaxed"
          >
            Menghadirkan teknologi dan layanan inovatif untuk memudahkan dalam
            mencari, memesan, dan mengelola titik billboard di berbagai lokasi.
          </p>
        </div>

        {/* Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 
                     gap-5 mt-10"
        >
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
            icon={Monitor}
            title="Monitoring Trafik"
            description="Nikmati live streaming trafik dan laporan data akurat untuk evaluasi iklan Anda."
          />
          <ValuesCard
            icon={TvMinimalPlay}
            title="Billboard Cerdas"
            description="Placers terus berkembang dengan teknologi IoT dan AI untuk efektivitas iklan maksimal."
          />
          <ValuesCard
            icon={MonitorSmartphone}
            title="Remote Monitoring"
            description="Pantau dan kelola titik iklan Anda dari jarak jauh dengan sistem RMM yang handal."
          />
        </div>
      </div>
    </section>
  );
}