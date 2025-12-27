import SectionTag from "./SectionTag";

export default function LandingAboutUs() {
    return (
        <section
            id="about-us"
            className="flex items-center justify-center bg-white w-full px-4 mt-4 md:mt-6 lg:mt-8"
        >
            <div
                className="flex flex-col items-center border-2 md:border-4 rounded-2xl border-dashed border-[var(--color-primary)] w-full max-w-6xl space-y-3 
                           py-6 px-4 
                           md:py-8 md:px-12 
                           lg:py-10 lg:px-24 
                           xl:py-12 xl:px-32"
            >
                <SectionTag
                    text="ABOUT US"
                    bgColor="var(--color-primary)"
                    textColor="white"
                />
                <h1
                    className="text-black font-bold text-center leading-tight
                               text-lg
                               md:text-xl
                               lg:text-2xl
                               xl:text-3xl"
                >
                    Billboardmu, Kapanpun, Dimanapun
                </h1>
                <p
                    className="text-black text-center leading-relaxed max-w-4xl
                               text-xs
                               md:text-sm
                               lg:text-base"
                >
                    Placers adalah divisi dari PT Utero Kreatif Indonesia, perusahaan kreatif dengan pengalaman lebih dari 25 tahun. Hadir sebagai solusi masa depan periklanan luar ruang, Placers menyatukan teknologi, transparansi, dan kemudahan dalam satu platform.
                </p>
            </div>
        </section>
    );
}