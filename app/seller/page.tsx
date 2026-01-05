'use client'

import { Megaphone, CreditCard, Settings, Link2 } from "lucide-react"
import Navbar from "@/components/NavBar"
import Footer from "@/components/footer/FootBar"
import Link from "next/link"
import { motion, Variants } from "framer-motion"
import Image from "next/image"

/* ================== ANIMATION VARIANTS ================== */
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
}

const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
}

/* ================== PAGE ================== */
export default function SellerPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#FCFCFC]">
            <Navbar />

            <main className="container mx-auto px-4 py-12 text-black">

                {/* ================= HERO SECTION ================= */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* LEFT CONTENT */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <motion.p
                            variants={fadeInUp}
                            className="text-2xl md:text-3xl font-bold mb-3"
                        >
                            Kembangkan Bisnis Anda <br /> Bersama Kami
                        </motion.p>

                        <motion.p
                            variants={fadeInUp}
                            className="text-gray-600 mb-6 text-base"
                        >
                            Gabung bersama ratusan Merchant dan kelola bisnis lebih mudah dengan Placers.
                        </motion.p>

                        <motion.div variants={fadeInUp}>
                            <Link href="/seller/register">
                                <button className="font-semibold text-white bg-[var(--color-primary)] rounded-xl text-sm py-3 px-6 animate-pulse-glow">
                                    Daftar jadi Seller Sekarang
                                </button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT IMAGE STACK */}
                    <motion.div
                        className="relative w-full flex justify-center md:justify-end"
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="relative w-full max-w-xl h-[360px] md:h-[420px]">

                            {/* IMAGE 1 */}
                            <motion.div
                                className="relative md:absolute md:top-0 md:left-0 w-[90%] md:w-[85%] h-[220px] md:h-[280px] rounded-2xl overflow-hidden shadow-lg"
                                whileHover={{ scale: 1.05, zIndex: 10 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Image
                                    src="/seller_page1.png"
                                    alt="Seller Preview 1"
                                    className="w-full h-full object-contain"
                                />
                            </motion.div>

                            {/* IMAGE 2 */}
                            <motion.div
                                className="relative mt-6 md:mt-0 md:absolute md:bottom-0 md:right-0 w-[90%] md:w-[85%] h-[220px] md:h-[280px] rounded-2xl overflow-hidden shadow-xl"
                                whileHover={{ scale: 1.05, zIndex: 20 }}
                                transition={{ duration: 0.4, delay: 0.15 }}
                            >
                                <Image
                                    src="/seller_page2.png"
                                    alt="Seller Preview 2"
                                    className="w-full h-full object-contain"
                                />
                            </motion.div>

                        </div>
                    </motion.div>
                </section>

                {/* ================= DIVIDER ================= */}
                <div className="my-16 border-t border-gray-200" />

                {/* ================= BENEFITS ================= */}
                <section className="mt-20">
                    <h2 className="text-2xl font-semibold mb-8">
                        Keuntungan Bergabung Sebagai Seller
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {[
                            {
                                icon: Megaphone,
                                title: "Promosi Luas",
                                desc: "Titik lokasi Anda dapat menjangkau lebih banyak pengiklan.",
                            },
                            {
                                icon: CreditCard,
                                title: "Pembayaran Aman",
                                desc: "Setiap transaksi diproses secara aman dan transparan.",
                            },
                            {
                                icon: Settings,
                                title: "Manajemen Mudah",
                                desc: "Kelola seluruh titik lokasi dalam satu platform.",
                            },
                            {
                                icon: Link2,
                                title: "Kemudahan Integrasi",
                                desc: "Platform dirancang agar langsung bisa digunakan.",
                            },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                className="flex gap-4"
                                variants={fadeInUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                <div className="w-12 h-12 flex items-center justify-center rounded-full border border-red-500 text-red-500 shrink-0">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                                    <p className="text-gray-600 text-sm">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ================= DIVIDER ================= */}
                <div className="my-16 border-t border-gray-200" />

                {/* ================= STEPS ================= */}
                <section className="mt-20 text-center">
                    <h2 className="text-xl font-semibold mb-2">
                        Sudah siap untuk mengembangkan bisnis Anda?
                    </h2>
                    <p className="text-gray-600 mb-12">
                        Hanya 3 langkah mudah untuk memulai
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: "Registrasi", desc: "Lengkapi data diri dan usaha." },
                            { title: "Verifikasi", desc: "Tim akan memverifikasi data." },
                            { title: "Mulai Kelola Merchant", desc: "Akun Seller siap digunakan." },
                        ].map((step, idx) => (
                            <motion.div
                                key={idx}
                                className="relative flex flex-col items-center"
                                variants={fadeInUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                <span className="absolute -top-6 text-7xl font-extrabold text-gray-200 select-none">
                                    {idx + 1}
                                </span>
                                <h3 className="relative font-semibold text-base md:text-lg mb-2">
                                    {step.title}
                                </h3>
                                <p className="relative text-gray-600 text-sm max-w-[220px] mx-auto">
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    )
}