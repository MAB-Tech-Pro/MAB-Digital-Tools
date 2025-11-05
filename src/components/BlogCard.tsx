interface Blog {
  id: number
  slug: string
  title: string
  date: string
}

export default function BlogCard({ blog }: { blog: Blog }) {
  return (
    <div className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
      <p className="text-gray-500 text-sm">{new Date(blog.date).toLocaleDateString()}</p>
    </div>
  )
}
