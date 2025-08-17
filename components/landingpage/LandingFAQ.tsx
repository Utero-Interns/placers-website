'use client';

import { useState } from "react";
import SectionTag from "./SectionTag";
import FAQPoint from "./FAQPoint";

export default function LandingFAQ() {
     const [expanded, setExpanded] = useState(false);

    return (
        <section 
            id="faq" 
            className="flex flex-col items-center justify-center bg-white w-full px-4 sm:px-6 lg:px-8 
                       mt-12 pb-12 
                       md:mt-16 md:pb-16 
                       2xl:mt-24 2xl:pb-24"
        >
            <SectionTag
                text="FAQ"
                bgColor="var(--color-primary)"
                textColor="white" 
            />

            <h1 className="text-center font-bold text-black mt-4 
                           text-3xl
                           md:text-4xl
                           lg:text-5xl
                           2xl:text-[64px] 2xl:mt-[5px]"
            >
                Ada Pertanyaan?<br/>Kami Punya Jawabannya
            </h1>

            <p className="text-center text-black mt-2 
                          text-base 
                          lg:text-lg 
                          xl:text-xl 
                          2xl:text-2xl 2xl:mt-[5px]"
            >
                Semua yang perlu Anda ketahui tentang Placers dan bagaimana platform ini dapat membantu kebutuhan iklan luar ruang Anda.
            </p>

            <div className="w-11/12 space-y-4 md:space-y-5 2xl:space-y-6 mt-8 md:mt-10">

                <FAQPoint
                question="Upload Lokasi Mudah dan Fleksibel"
                answer="Upload titik billboard bisa dilakukan di mana saja dan kapan saja, tanpa batasan wilayah atau waktu."
                />

                <FAQPoint
                question="Cari Titik Billboard Tanpa Ribet"
                answer="Dengan teknologi pencarian pintar, temukan lokasi billboard sesuai target audiens Anda dengan cepat dan akurat."
                />

                <FAQPoint
                question="Hemat Biaya & Transparan"
                answer="Proses transaksi langsung dengan pemilik titik lokasi atau penerima kuasa, tanpa perantara, membuat biaya lebih efisien dan transparan."
                />

                <FAQPoint
                question="Live Streaming Traffic & Laporan Real-Time"
                answer="Nikmati fasilitas pemantauan trafik live streaming dan akses laporan data akurat dan real-time untuk evaluasi efektivitas iklan Anda."
                />

                <FAQPoint
                question="Menuju Billboard Cerdas"
                answer="Terus berkembang menuju sistem billboard pintar dengan dukungan teknologi IoT (Internet of Things) dan AI (Artificial Intelligence)."
                />

                <FAQPoint
                question="Remote Monitoring Management (RMM)"
                answer="Semua titik iklan dapat dipantau dan dikelola dari jarak jauh menggunakan sistem RMM, memastikan performa dan keandalan terus terjaga."
                />

            </div>
        </section>
    );
}