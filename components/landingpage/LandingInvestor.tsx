import Image from "next/image";
import SectionTag from "./SectionTag";

export default function LandingInvestor() {
  return (
    <section
      id="investor"
      className="
        bg-white w-full
        px-4 md:px-8 2xl:px-16
        mt-8 md:mt-12 lg:mt-16
      "
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Tag */}
        <SectionTag
          text="FOR INVESTOR"
          bgColor="var(--color-primary)"
          textColor="white"
        />

        {/* Content */}
        <div
          className="
            flex flex-col lg:flex-row
            items-center lg:items-start
            justify-between
            mt-8 md:mt-12
            gap-10 lg:gap-16
          "
        >
          {/* Image */}
          <div className="w-full md:w-1/2 lg:w-5/12">
            <Image
              src="/investor.png"
              alt="Investor discussing plans"
              width={600}
              height={600}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>

          {/* Text */}
          <div className="w-full md:w-1/2 lg:w-7/12 flex flex-col">
            <h1
              className="
                font-bold text-black leading-tight
                text-xl md:text-2xl lg:text-3xl
              "
            >
              Bergabunglah Bersama Kami sebagai Investor Placers
            </h1>

            <p
              className="
                mt-4 leading-relaxed
                text-sm md:text-base
                text-black
              "
            >
              Dukung transformasi industri periklanan luar ruang di Indonesia
              bersama Placers. Kami membuka peluang bagi para investor untuk
              berkontribusi dalam menghadirkan teknologi dan solusi inovatif yang
              menghubungkan pengiklan dan pemilik billboard secara langsung.
            </p>

            <a
              href="#"
              className="
                mt-6 w-fit
                font-bold
                text-sm
                text-[var(--color-primary)]
                bg-[var(--color-primary)]/10
                hover:bg-[var(--color-primary)]
                hover:text-white
                transition-colors duration-300
                rounded-lg
                py-2 px-6
              "
            >
              Jadi Investor Sekarang
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}