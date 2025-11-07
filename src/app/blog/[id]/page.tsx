import Link from "next/link";
import blogData from "../../../data/blog.json";

type Params = { params: { id: string } };

export default function BlogPostPage({ params }: Params) {
  const post = (blogData as any[]).find((p) => String(p.id) === String(params.id));

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 select-none">
        <div className="rounded-2xl border bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Post not found</h1>
          <p className="mt-2 text-gray-600">Requested blog post does not exist.</p>
          <div className="mt-4">
            <Link href="/blog" className="text-blue-600 hover:underline font-medium">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 select-none">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{post.title}</h1>
        {post.date ? (
          <time className="mt-2 block text-sm text-gray-500">{post.date}</time>
        ) : null}
      </header>

      {/* NOTE: by requirement, no featured image */}

      {/* Content */}
      <div className="prose prose-sm sm:prose-base max-w-none text-gray-800 select-none">
        {/* If your JSON has 'content' as HTML/markdown, adapt this.
            For demo JSON (description only), we show description paragraphs. */}
        {post.description ? <p>{post.description}</p> : null}
        {post.content ? (
          <div className="mt-4 whitespace-pre-wrap">{post.content}</div>
        ) : null}
      </div>

      <footer className="mt-10">
        <Link href="/blog" className="text-blue-600 hover:underline font-medium">
          ← Back to Blog
        </Link>
      </footer>
    </article>
  );
}
