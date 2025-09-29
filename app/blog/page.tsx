"use client"
import BlogGrid from "@/components/blog/BlogGrid"
import BlogPagination from "@/components/blog/BlogPagination"
import NavBar from "@/components/NavBar"
import FootBar from "@/components/footer/FootBar"
import BlogHero from "@/components/blog/BlogHero"

const dummyArticles = Array(9).fill(null).map((_, i) => ({
  id: i + 1, // kasih id unik
  title: "Apakah Film Animasi Merah Putih One for All jadi tayang di bioskop?",
  description: "Film ini dijadwalkan tayang di bioskop...",
  image: "/blog-sample.png",
  author: "Admin Placer's",
  date: "Sep 26, 2025",
}))


export default function BlogPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Navbar */}
      <NavBar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <BlogHero />
        
        {/* Grid Artikel */}
        <BlogGrid articles={dummyArticles} />

        {/* Pagination */}
        <div className="mt-10 flex justify-center">
          <BlogPagination currentPage={1} totalPages={5} onPageChange={() => {}} />
        </div>
      </main>

      {/* Footer */}
      <FootBar />
    </div>
  )
}
