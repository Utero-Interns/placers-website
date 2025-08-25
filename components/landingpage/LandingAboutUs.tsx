import SectionTag from "./SectionTag";

export default function LandingAboutUs() {
    return (
        <section 
            id="about-us" 
            className="flex items-center justify-center bg-white w-full px-4 mt-8 md:mt-12 lg:mt-16"
        >
            <div 
                className="flex flex-col items-center border-4 rounded-2xl border-dashed border-[var(--color-primary)] w-11/12 space-y-4 
                           py-8 px-4 
                           md:py-10 md:px-8 
                           lg:py-12 lg:px-16 
                           xl:py-14 xl:px-24 
                           2xl:py-16 2xl:px-40"
            >
                <SectionTag
                    text="ABOUT US"
                    bgColor="var(--color-primary)"
                    textColor="white"
                />
                <h1 
                    className="text-black font-bold text-center 
                               text-2xl 
                               lg:text-3xl 
                               2xl:text-4xl"
                >
                    Billboardmu, Kapanpun, Dimanapun
                </h1>
                <p 
                    className="text-black text-center 
                               text-base 
                               lg:text-lg 
                               xl:text-xl 
                               2xl:text-2xl"
                >
                    Placers adalah divisi dari PT Utero Kreatif Indonesia, perusahaan kreatif dengan pengalaman lebih dari 25 tahun. Hadir sebagai solusi masa depan periklanan luar ruang, Placers menyatukan teknologi, transparansi, dan kemudahan dalam satu platform.
                </p>
            </div>
          
        </section>
    );
}