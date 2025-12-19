import Image from "next/image";
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

                <div className="w-full md:w-1/2 lg:w-4/12">
                    <Image
                        src="/investor.png"
                        alt="Investor discussing plans"
                        width={600}
                        height={600}
                        className="w-full h-auto rounded-lg object-cover"
                    />
                </div>

                <div className="w-full md:w-1/2 lg:w-7/12 flex flex-col text-left">
                    <h1 className="font-bold text-black leading-tight
                                   text-xl md:text-2xl lg:text-2xl
                                   w-full">
                        Bergabunglah Bersama Kami sebagai Investor Placers
                    </h1>

                    <p className="mt-3 leading-relaxed
                                text-sm md:text-sm lg:text-base
                                text-black">
                        Dukung transformasi industri periklanan luar ruang di Indonesia bersama Placers. Kami membuka peluang bagi para investor untuk berkontribusi dalam menghadirkan teknologi dan solusi inovatif yang menghubungkan pengiklan dan pemilik billboard secara langsung.
                    </p>

                    <a
                        href="#"
                        className="font-bold bg-[var(--color-primary)]/10 rounded-[8px] inline-block mt-4 w-fit hover:bg-[var(--color-primary)] hover:text-white transition-colors duration-300
                                   text-[var(--color-primary)]
                                   text-sm py-2 px-6"
                    >
                        Jadi Investor Sekarang
                    </a>
                </div>
            </div>
        </section>
    );
}
