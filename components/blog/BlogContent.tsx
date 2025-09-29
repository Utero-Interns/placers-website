import { ChevronLeft } from "lucide-react"
import Link from "next/link"

interface BlogContentProps {
  id: string
  title: string
  author: string
  date: string
  image: string
  content: string
}

export default function BlogContent({
  id,
  title,
  author,
  date,
  image,
  content,
}: BlogContentProps) {
  return (
    <div>
      {/* Tombol kembali */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-3 hover:opacity-80 transition mb-6"
      >
        {/* Icon lingkaran merah */}
        <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-red-500 text-red-500">
          <ChevronLeft size={20} strokeWidth={2.5} />
        </div>

        {/* Teks */}
        <span className="text-sm font-medium">Kembali ke Blog</span>
      </Link>

      {/* Judul */}
      <h1 className="text-2xl lg:text-3xl font-bold mb-2">{title}</h1>

      {/* Author + Date */}
      <p className="text-sm text-gray-500 mb-6">
        {author} • {date}
      </p>

      {/* Gambar */}
      <img
        src={image}
        alt={title}
        className="w-full rounded-lg mb-6"
      />

      {/* Isi Artikel */}
      <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
        {content.split("\n").map((para, i) =>
          para.trim() ? <p key={i}>{para.trim()}</p> : null
        )}
      </div>
    </div>
  )
}
