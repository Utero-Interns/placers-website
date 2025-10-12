import Link from "next/link"

interface BlogCardProps {
  id: string
  image: string
  title: string
  description: string
  author: string
  date: string
}

export default function BlogCard({
  id,
  image,
  title,
  description,
  author,
  date,
}: BlogCardProps) {
  return (
    <Link href={`/blog/${id}`}>
      <div className="rounded-lg shadow-md overflow-hidden bg-white cursor-pointer hover:shadow-lg transition">
        {/* Full Image (sudah ada teks di dalam gambar) */}
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
          <p className="text-gray-500 text-xs">
            {author} • {date}
          </p>
        </div>
      </div>
    </Link>
  )
}
