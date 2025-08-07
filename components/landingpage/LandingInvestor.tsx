import SectionTag from "./SectionTag";

export default function LandingInvestor() {
    return (
        <section id="investor" className="flex flex-col items-center bg-white w-full mt-24">
            <div className="flex justify-start w-11/12">
                <SectionTag
                    text="FOR INVESTOR"
                    bgColor="var(--color-primary)"
                    textColor="white" 
                />
            </div>

            <div className="flex items-center justify-between mt-[60px] w-11/12">

                <img src="/investor.png" alt="" className="h-[500px] w-auto"/>

                <div className="w-[57%]">
                    <h1 className="font-bold text-4xl text-black w-2/3 leading-normal">
                        Bergabunglah Bersama Kami sebagai Investor Placers 
                    </h1>

                    <p className="text-2xl text-black mt-4">
                        Dukung transformasi industri periklanan luar ruang di Indonesia bersama Placers. Kami membuka peluang bagi para investor untuk berkontribusi dalam menghadirkan teknologi dan solusi inovatif yang menghubungkan pengiklan dan pemilik billboard secara langsung.
                    </p>

                    <a href="" className="font-bold text-[20px] text-[var(--color-primary)] py-3 px-9 bg-[var(--color-primary)]/10 rounded-[10px] block mt-6 w-fit hover:bg-[var(--color-primary)] hover:text-white">
                        Jadi Investor Sekarang 
                    </a>
                </div>

            </div>
        </section>
    );
}