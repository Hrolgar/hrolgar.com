import { getPosts, getCategories } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on development, homelab, and technology",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl font-bold text-foreground mb-4">Blog</h1>
            <p className="text-muted text-base">
              Thoughts on development, homelab, and technology
            </p>
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              <a
                href="/blog"
                className="text-xs bg-primary/15 text-primary px-3 py-1.5 rounded font-medium border border-transparent"
                aria-current="page"
              >
                All
              </a>
              {categories.map((cat) => (
                <a
                  key={cat._id}
                  href={`/blog/category/${cat.slug.current}`}
                  className="text-xs bg-surface text-muted px-3 py-1.5 rounded border border-border hover:text-foreground hover:border-primary transition-all"
                >
                  {cat.title}
                </a>
              ))}
            </div>
          )}

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted text-base">No posts yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <a
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="group block bg-surface rounded overflow-hidden border border-border hover:border-primary transition-colors"
                  aria-label={`Read: ${post.title}`}
                >
                  {post.coverImage && (
                    <div className="overflow-hidden aspect-video">
                      <Image
                        src={urlFor(post.coverImage).width(400).height(225).url()}
                        alt={post.title}
                        width={400}
                        height={225}
                        className="w-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <time className="text-xs text-muted" dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                      </time>
                      {post.featured && (
                        <span className="text-[10px] bg-accent/15 text-accent px-2 py-0.5 rounded font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                    <h2 className="font-[family-name:var(--font-serif)] text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted text-sm line-clamp-3">{post.excerpt}</p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] text-muted bg-surface-hover px-2 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
