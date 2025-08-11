import SectionTag from "./SectionTag";

export default function LandingInvestor() {
    return (
        <section 
            id="investor" 
            className="flex flex-col items-center bg-white w-full px-4 sm:px-6 lg:px-8 mt-12 md:mt-16 2xl:mt-24"
        >
            {/* Using max-width and mx-auto for consistent centering */}
            <div className="w-11/12">
                <SectionTag
                    text="FOR INVESTOR"
                    bgColor="var(--color-primary)"
                    textColor="white" 
                />
            </div>

            {/* Layout stacks on mobile (flex-col) and becomes a row on large screens (lg:flex-row) */}
            <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between w-11/12 mt-8 md:mt-12 2xl:mt-[60px] gap-10 lg:gap-16">

                {/* Responsive image that scales properly */}
                <img 
                    src="/investor.png" 
                    alt="Investor discussing plans" 
                    className="w-full md:w-3/4 lg:w-5/12 h-auto rounded-lg object-cover"
                />

                {/* Text container with responsive width and alignment */}
                <div className="w-full lg:w-7/12 flex flex-col items-center lg:items-start text-center lg:text-left">
                    {/* Responsive heading */}
                    <h1 className="font-bold text-black leading-snug lg:leading-normal
                                   text-3xl
                                   xl:text-4xl 
                                   w-full lg:w-5/6 2xl:w-2/3">
                        Bergabunglah Bersama Kami sebagai Investor Placers 
                    </h1>

                    {/* Responsive paragraph */}
                    <p className="mt-4
                                text-base
                                text-black
                                md:text-lg
                                xl:text-xl
                                2xl:text-2xl">
                        Dukung transformasi industri periklanan luar ruang di Indonesia bersama Placers. Kami membuka peluang bagi para investor untuk berkontribusi dalam menghadirkan teknologi dan solusi inovatif yang menghubungkan pengiklan dan pemilik billboard secara langsung.
                    </p>

                    {/* Responsive button */}
                    <a 
                        href="#" 
                        className="font-bold bg-[var(--color-primary)]/10 rounded-[10px] block mt-6 w-fit hover:bg-[var(--color-primary)] hover:text-white transition-colors duration-300
                                   text-[var(--color-primary)]
                                   text-base py-2.5 px-8
                                   xl:text-lg
                                   2xl:text-[20px] 2xl:py-3 2xl:px-9"
                    >
                        Jadi Investor Sekarang 
                    </a>
                </div>
            </div>
        </section>
    );
}