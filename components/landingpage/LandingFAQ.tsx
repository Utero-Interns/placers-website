'use client';

import { useState } from "react";
import SectionTag from "./SectionTag";
import FAQPoint from "./FAQPoint";

export default function LandingFAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Upload Lokasi Mudah dan Fleksibel",
      answer:
        "Upload titik billboard bisa dilakukan di mana saja dan kapan saja, tanpa batasan wilayah atau waktu.",
    },
    {
      question: "Cari Titik Billboard Tanpa Ribet",
      answer:
        "Dengan teknologi pencarian pintar, temukan lokasi billboard sesuai target audiens Anda dengan cepat dan akurat.",
    },
    {
      question: "Hemat Biaya & Transparan",
      answer:
        "Proses transaksi langsung dengan pemilik titik lokasi atau penerima kuasa, tanpa perantara, membuat biaya lebih efisien dan transparan.",
    },
    {
      question: "Live Streaming Traffic & Laporan Real-Time",
      answer:
        "Nikmati fasilitas pemantauan trafik live streaming dan akses laporan data akurat dan real-time untuk evaluasi efektivitas iklan Anda.",
    },
    {
      question: "Menuju Billboard Cerdas",
      answer:
        "Terus berkembang menuju sistem billboard pintar dengan dukungan teknologi IoT (Internet of Things) dan AI (Artificial Intelligence).",
    },
    {
      question: "Remote Monitoring Management (RMM)",
      answer:
        "Semua titik iklan dapat dipantau dan dikelola dari jarak jauh menggunakan sistem RMM, memastikan performa dan keandalan terus terjaga.",
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

        <h1
          className="
            text-center font-bold text-black
            mt-4
            text-xl md:text-2xl lg:text-3xl
            leading-tight
          "
        >
          Ada Pertanyaan?
          <br />
          Kami Punya Jawabannya
        </h1>

        <p
          className="
            text-center text-black
            mt-2
            text-sm md:text-base lg:text-base
            2xl:text-lg
            max-w-3xl
          "
        >
          Semua yang perlu Anda ketahui tentang Placers dan bagaimana platform ini
          dapat membantu kebutuhan iklan luar ruang Anda.
        </p>

        <div
          className="
            w-full
            mt-8 md:mt-10
            space-y-4 md:space-y-5 2xl:space-y-6
          "
        >
          {faqs.map((faq, i) => (
            <FAQPoint
              key={i}
              question={faq.question}
              answer={faq.answer}
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