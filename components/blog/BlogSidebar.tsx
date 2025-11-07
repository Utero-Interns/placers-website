import Image from "next/image"
import Link from "next/link"

type Blog = {
  id: string
  title: string
  image: string
  date: string
}

interface BlogSidebarProps {
  blogs: Blog[]
}

export default function BlogSidebar({ blogs }: BlogSidebarProps) {
  if (blogs.length === 0) return null

  const [first, ...rest] = blogs

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Artikel Terkini</h2>

      {/* Artikel Utama (besar) */}
      <Link
        href={`/blog/${first.id}`}
        className="block group"
      >
        <Image
          src={first.image}
          alt={first.title}
          className="w-full h-40 object-cover rounded-lg"
        />
        <h3 className="mt-2 font-semibold text-sm group-hover:text-red-600 transition">
          {first.title}
        </h3>
        <p className="text-xs text-gray-500">{first.date}</p>
      </Link>

      {/* List Artikel Kecil */}
      <div className="mt-6 space-y-4">
        {rest.map((blog) => (
          <Link
        key={blog.id}
        href={`/blog/${blog.id}`}
        className="flex items-start gap-2 hover:bg-gray-50 p-1 rounded-lg transition"
          >
        <Image
          src={blog.image}
          alt={blog.title}
          className="w-20 h-16 object-cover rounded-md flex-shrink-0"
        />
        <div>
          <h3 className="text-sm font-medium leading-snug line-clamp-2 hover:text-red-600 transition">
            {blog.title}
          </h3>
          <p className="text-xs text-gray-500">{blog.date}</p>
        </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
