import SectionTag from "./SectionTag";

export default function LandingInvestor() {
    return (
        <section
            id="investor"
            className="flex flex-col items-center bg-white w-full px-4 sm:px-6 lg:px-8"
        >
            <div className="w-11/12">
                <SectionTag
                    text="FOR INVESTOR"
                    bgColor="var(--color-primary)"
                    textColor="white"
                />
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between w-11/12 mt-8 md:mt-12 2xl:mt-[60px] gap-10 lg:gap-16">

                <img
                    src="/investor.png"
                    alt="Investor discussing plans"
                    className="w-full md:w-3/4 lg:w-5/12 h-auto rounded-lg object-cover"
                />

                <div className="w-full lg:w-7/12 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <h1 className="font-bold text-black leading-snug lg:leading-normal
                                   text-2xl
                                   xl:text-3xl 
                                   w-full lg:w-5/6 2xl:w-2/3">
                        Bergabunglah Bersama Kami sebagai Investor Placers
                    </h1>

                    <p className="mt-4 leading-relaxed
                                text-base
                                text-black
                                md:text-sm
                                xl:text-base
                                2xl:text-lg">
                        Dukung transformasi industri periklanan luar ruang di Indonesia bersama Placers. Kami membuka peluang bagi para investor untuk berkontribusi dalam menghadirkan teknologi dan solusi inovatif yang menghubungkan pengiklan dan pemilik billboard secara langsung.
                    </p>

                    <a
                        href="#"
                        className="font-bold bg-[var(--color-primary)]/10 rounded-[10px] block mt-6 w-fit hover:bg-[var(--color-primary)] hover:text-white transition-colors duration-300
                                   text-[var(--color-primary)]
                                   text-sm py-2.5 px-8
                                   xl:text-base
                                   lg:text-[20px] 2xl:py-3 2xl:px-9"
                    >
                        Jadi Investor Sekarang
                    </a>
                </div>
            </div>
        </section>
    );
}