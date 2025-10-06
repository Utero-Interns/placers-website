import { Megaphone, CreditCard, Settings, Link2 } from "lucide-react"
import Navbar from "@/components/NavBar"
import Footer from "@/components/footer/FootBar"
import Link from "next/link"

export default function SellerPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <main className="px-6 md:px-16 lg:px-24 py-12 text-black">

                {/* Hero Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-3">
                            Kembangkan Bisnis Anda <br /> Bersama Kami
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Gabung bersama ratusan Merchant dan kelola bisnis lebih mudah dengan Placers.
                        </p>
                        <Link href="/seller/register">
                            <button className="bg-[var(--color-primary)] hover:bg-red-700 text-white rounded-md px-5 py-2 text-base">
                                Daftar jadi Seller Sekarang
                            </button>
                        </Link>
                    </div>

                    <div className="flex justify-center">
                        <div className="w-full h-48 md:h-56 lg:h-64 bg-gray-200 flex items-center justify-center rounded-md text-gray-500">
                            mockup admin page
                        </div>
                    </div>
                </section>

                {/* Divider */}
                <div className="my-16 border-t border-gray-200"></div>

                {/* Keuntungan Section */}
                <section className="mt-20">
                    <h2 className="text-2xl font-semibold mb-8">
                        Keuntungan Bergabung Sebagai Seller
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-red-500 text-red-500 shrink-0">
                                <Megaphone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Promosi Luas</h3>
                                <p className="text-gray-600 text-sm">
                                    Titik lokasi Anda dapat menjangkau lebih banyak pengiklan, sehingga peluang untuk
                                    disewa menjadi semakin tinggi.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-red-500 text-red-500 shrink-0">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Pembayaran Aman</h3>
                                <p className="text-gray-600 text-sm">
                                    Setiap transaksi diproses secara aman dan transparan sehingga pemilik lokasi dapat
                                    memantau pembayaran dengan mudah.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-red-500 text-red-500 shrink-0">
                                <Settings className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Manajemen Mudah</h3>
                                <p className="text-gray-600 text-sm">
                                    Seluruh titik lokasi dapat dikelola dengan praktis dalam satu platform tanpa perlu
                                    proses manual yang rumit.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-red-500 text-red-500 shrink-0">
                                <Link2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Kemudahan Integrasi</h3>
                                <p className="text-gray-600 text-sm">
                                    Platform dirancang agar mudah digunakan sehingga pemilik lokasi dapat langsung
                                    mengelola tanpa kendala.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Divider */}
                <div className="my-16 border-t border-gray-200"></div>

                {/* Step Section */}
                <section className="mt-20 text-center">
                    <h2 className="text-xl font-semibold mb-2">
                        Sudah siap untuk mengembangkan bisnis Anda?
                    </h2>
                    <p className="text-gray-600 mb-12">Hanya 3 langkah mudah untuk memulai</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: "Registrasi", desc: "Lengkapi data diri dan informasi usaha." },
                            { title: "Verifikasi", desc: "Tim akan memverifikasi data." },
                            { title: "Mulai Kelola Merchant", desc: "Selamat! Akun Seller Anda dapat digunakan." },
                        ].map((step, idx) => (
                            <div key={idx} className="relative flex flex-col items-center">
                                {/* Angka besar di background */}
                                <span className="absolute -top-6 text-7xl font-extrabold text-gray-200 select-none">
                                    {idx + 1}
                                </span>

                                {/* Judul */}
                                <h3 className="relative font-semibold text-base md:text-lg mb-2">
                                    {step.title}
                                </h3>

                                {/* Deskripsi */}
                                <p className="relative text-gray-600 text-sm max-w-[220px] mx-auto">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    )
}