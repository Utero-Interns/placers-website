'use client';

import { useState } from "react";
import SectionTag from "./SectionTag";
import FAQPoint from "./FAQPoint";

type FAQAccess = "default" | "upgrade";

interface FAQItem {
  question: string;
  answer: string;
  access: FAQAccess;
}

export default function LandingFAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Upload Lokasi Mudah dan Fleksibel",
      answer:
        "Upload titik billboard bisa dilakukan di mana saja dan kapan saja, tanpa batasan wilayah atau waktu.",
      access: "default",
    },
    {
      question: "Cari Titik Billboard Tanpa Ribet",
      answer:
        "Dengan teknologi pencarian pintar, temukan lokasi billboard sesuai target audiens Anda dengan cepat dan akurat.",
      access: "default",
    },
    {
      question: "Hemat Biaya & Transparan",
      answer:
        "Proses transaksi langsung dengan pemilik titik lokasi atau penerima kuasa, tanpa perantara, membuat biaya lebih efisien dan transparan.",
      access: "default",
    },
    {
      question: "Live Streaming Traffic & Laporan Real-Time",
      answer:
        "Fitur pemantauan trafik melalui live streaming serta laporan data real-time untuk evaluasi performa iklan. Tersedia pada paket Upgrade.",
      access: "upgrade",
    },
    {
      question: "Menuju Billboard Cerdas",
      answer:
        "Pengembangan berkelanjutan menuju sistem billboard pintar dengan dukungan teknologi IoT dan AI. Termasuk dalam paket Upgrade.",
      access: "upgrade",
    },
    {
      question: "Remote Monitoring Management (RMM)",
      answer:
        "Pemantauan dan pengelolaan seluruh titik iklan dari jarak jauh menggunakan sistem RMM. Tersedia setelah upgrade paket.",
      access: "upgrade",
    },
  ];

  return (
    <section
      id="faq"
      className="
        bg-[#FCFCFC] w-full
        px-4 md:px-8 2xl:px-16
        mt-8 md:mt-12 lg:mt-16
        pb-12 md:pb-16 lg:pb-20
      "
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
        <SectionTag
          text="FAQ"
          bgColor="var(--color-primary)"
          textColor="white"
        />

        <h1 className="text-center font-bold text-black mt-4 text-xl md:text-2xl lg:text-3xl">
          Ada Pertanyaan?
          <br />
          Kami Punya Jawabannya
        </h1>

        <p className="text-center text-black mt-2 text-sm md:text-base max-w-3xl">
          Semua yang perlu Anda ketahui tentang Placers dan bagaimana platform ini
          membantu kebutuhan iklan luar ruang Anda.
        </p>

        <div className="w-full mt-8 space-y-4">
          {faqs.map((faq, i) => (
            <FAQPoint
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              access={faq.access}
              expanded={expandedIndex === i}
              onClick={() =>
                setExpandedIndex(expandedIndex === i ? null : i)
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}