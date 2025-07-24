export default function LandingAboutUs() {
    return (
        <section id="about-us" className="flex items-center justify-center bg-white w-full pt-5">
            <div className="flex flex-col items-center border-4 rounded-2xl border-dashed border-[var(--color-primary)] py-16 px-40 w-11/12 space-y-4" >
                <h1 className="text-white text-[18px] font-bold bg-[var(--color-primary)] py-2 px-12 w-fit rounded-full">
                    ABOUT US
                </h1>
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