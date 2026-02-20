"use client"
import NavBar from "@/components/NavBar"
import FootBar from "@/components/footer/FootBar"
import BlogHero from "@/components/blog/BlogHero"
import { Newspaper } from "lucide-react"

export default function BlogPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-8 py-10 text-black">
        <BlogHero />

        {/* Empty state — blog endpoint not yet available on backend */}
        <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400">
          <Newspaper className="w-16 h-16 mb-4 opacity-40" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Artikel</h2>
          <p className="text-sm max-w-sm">
            Konten blog sedang dalam persiapan. Pantau terus halaman ini untuk artikel-artikel terbaru dari Placers.
          </p>
        </div>
      </main>

      <FootBar />
    </div>
  )
}
