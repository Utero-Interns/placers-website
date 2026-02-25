import NavBar from "@/components/NavBar"
import FootBar from "@/components/footer/FootBar"
import BlogContent from "@/components/blog/BlogContent"
import BlogSidebar from "@/components/blog/BlogSidebar"
import type { Metadata } from "next"

type Blog = {
  id: string
  title: string
  author: string
  date: string
  image: string
  content: string
}

const blogs: Blog[] = [
  {
    id: "1",
    title: "Apakah Film Animasi Merah Putih One for all jadi tayang di bioskop??",
    author: "John Doe",
    date: "Agustus 19, 2025",
    image: "/blog-sample.png",
    content: `
      Film animasi Indonesia terbaru yang berjudul "Merah Putih: One for All" mulai ditayangkan
      di sejumlah bioskop di kawasan Jakarta, Bogor, Depok, Tangerang, dan Bekasi (Jabodetabek)
      pada hari ini, Kamis, 14 Agustus 2025. Penayangan film ini bertepatan dengan momen menjelang
      perayaan Hari Ulang Tahun (HUT) ke-80 Kemerdekaan Republik Indonesia.
      
      Film yang diproduksi oleh Pertiwi Kreasiindo ini memiliki durasi 1 jam 10 menit dan diklasifikasikan
      untuk semua umur (SU). "Merah Putih: One for All" hadir dalam format 2D dan menceritakan kisah tentang
      petualangan sekelompok anak dari berbagai suku di Indonesia yang bersatu untuk menemukan kebenaran
      di balik benda pusaka yang hilang secara misterius.
      
      Berdasarkan informasi dari aplikasi pemesanan tiket bioskop M-Tix, beberapa jaringan bioskop besar
      di Jabodetabek telah menjadwalkan penayangan film ini. Di antaranya adalah:
    `,
  },
  {
    id: "2",
    title: "5 Rekomendasi Film Indonesia yang Wajib Ditonton di 2025",
    author: "Jane Smith",
    date: "Agustus 10, 2025",
    image: "/blog-sample.png",
    content: "Tahun 2025 akan menjadi tahun yang penuh warna bagi perfilman Indonesia...",
  },
  {
    id: "3",
    title: "Behind The Scene: Proses Kreatif di Balik Film Animasi Merah Putih",
    author: "Michael Tan",
    date: "Agustus 5, 2025",
    image: "/blog-sample.png",
    content: "Proses kreatif pembuatan film animasi 'Merah Putih: One for All' ternyata memakan waktu hampir 3 tahun...",
  },
  {
    id: "4",
    title: "Dampak Positif Film Animasi Terhadap Industri Kreatif Indonesia",
    author: "Siti Nurhaliza",
    date: "Juli 28, 2025",
    image: "/blog-sample.png",
    content: "Film animasi tidak hanya menghibur, tetapi juga memberikan dampak positif yang signifikan terhadap industri kreatif di Indonesia...",
  },
  {
    id: "5",
    title: "Wawancara Eksklusif dengan Sutradara Film Merah Putih: One for All",
    author: "Andi Wijaya",
    date: "Juli 20, 2025",
    image: "/blog-sample.png",
    content: "Kami berkesempatan untuk mewawancarai langsung sutradara film 'Merah Putih: One for All' tentang visi dan tantangan dalam pembuatan film ini...",
  }
]

interface BlogDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const blog = blogs.find((b) => b.id === id)
  
  if (!blog) {
    return {
      title: 'Artikel Tidak Ditemukan',
      description: 'Artikel yang Anda cari tidak ditemukan',
    }
  }

  return {
    title: blog.title,
    description: blog.content.substring(0, 160),
    openGraph: {
      title: blog.title,
      description: blog.content.substring(0, 160),
      type: 'article',
      publishedTime: blog.date,
      authors: [blog.author],
    },
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params
  const blog = blogs.find((b) => b.id === id)
  const otherBlogs = blogs.filter((b) => b.id !== id)

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <NavBar />
        <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold">Artikel tidak ditemukan</h1>
        </main>
        <FootBar />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />

      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-8 py-10 text-black">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Konten utama */}
          <div className="lg:col-span-2">
            <BlogContent
              id={blog.id}
              title={blog.title}
              author={blog.author}
              date={blog.date}
              image={blog.image}
              content={blog.content}
            />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 lg:pt-80 pt-10">
            <BlogSidebar blogs={otherBlogs} />
          </aside>
        </div>
      </main>

      <FootBar />
    </div>
  )
}
