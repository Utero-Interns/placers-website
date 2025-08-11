import SectionTag from "./SectionTag";

export default function LandingAboutUs() {
    return (
        <section id="about-us" className="flex items-center justify-center bg-white w-full mt-5">
            <div className="flex flex-col items-center border-4 rounded-2xl border-dashed border-[var(--color-primary)] py-16 px-40 w-11/12 space-y-4" >
                <SectionTag
                    text="ABOUT US"
                    bgColor="var(--color-primary)"
                    textColor="white"
                />

                <h1 className="text-black text-4xl font-bold ml-12">
                    Billboardmu, Kapanpun, Dimanapun
                </h1>
                
                <p className="text-black text-2xl text-center">
                    Placers adalah divisi dari PT Utero Kreatif Indonesia, perusahaan kreatif dengan pengalaman lebih dari 25 tahun. Hadir sebagai solusi masa depan periklanan luar ruang, Placers menyatukan teknologi, transparansi, dan kemudahan dalam satu platform.
                </p>
            </div>
          
        </section>
    );
}