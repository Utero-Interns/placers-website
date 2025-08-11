'use client';

import { useState } from "react";
import SectionTag from "./SectionTag";
import FAQPoint from "./FAQPoint";

export default function LandingFAQ() {
     const [expanded, setExpanded] = useState(false);

    return (
        <section id="faq" className="flex flex-col items-center justify-center bg-white w-full mt-24 pb-24">
            <SectionTag
                text="FAQ"
                bgColor="var(--color-primary)"
                textColor="white" 
            />

            <h1 className="text-[64px] text-center font-bold text-black mt-[5px]">
                Ada Pertanyaan?<br/>Kami Punya Jawabannya
            </h1>

            <p className="text-2xl text-center text-black mt-[5px]">
                Semua yang perlu Anda ketahui tentang Placers dan bagaimana platform ini dapat membantu kebutuhan iklan luar ruang Anda.
            </p>

            <div className="w-11/12 space-y-6 mt-10">

                <FAQPoint
                question="Apa itu Placers dan bagaimana cara kerjanya?"
                answer="Placers adalah platform yang menghubungkan pemilik billboard dengan pengiklan secara langsung melalui teknologi digital yang efisien dan transparan."
                />

                <FAQPoint
                question="Bagaimana cara menjadi investor di platform ini?"
                answer="Anda dapat mendaftar melalui website resmi kami dan mengikuti proses verifikasi untuk mulai berinvestasi dalam proyek yang tersedia."
                />

                <FAQPoint
                question="Apakah platform ini aman untuk berinvestasi?"
                answer="Kami menggunakan sistem yang transparan dan aman untuk memastikan perlindungan data dan kepercayaan pengguna."
                />

                <FAQPoint
                question="Berapa jumlah minimal untuk mulai berinvestasi?"
                answer="Jumlah minimal investasi tergantung pada proyek yang dipilih, namun rata-rata dimulai dari Rp5.000.000."
                />

                <FAQPoint
                question="Bagaimana sistem keuntungan bekerja bagi investor?"
                answer="Investor akan mendapatkan bagi hasil dari pendapatan yang dihasilkan proyek, sesuai dengan porsi investasi masing-masing."
                />

                <FAQPoint
                question="Apakah saya bisa memilih proyek yang ingin saya danai?"
                answer="Ya, Anda bisa memilih proyek berdasarkan preferensi seperti lokasi, jenis proyek, dan estimasi imbal hasil."
                />

            </div>
        </section>
    );
}