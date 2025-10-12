import BlogCard from "./BlogCard"

interface BlogGridProps {
    articles: {
        title: string
        description: string
        image: string
        date: string
    }[]
}

export default function BlogGrid({ articles }: BlogGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((blog, i) => (
                <BlogCard id={""} author={""} key={i} {...blog} />
            ))}
        </div>

    )
}
