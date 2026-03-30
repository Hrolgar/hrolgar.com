import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import type { Post } from "@/sanity/types";

interface Props {
  posts: Post[];
  heading?: string | null;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPreview({ posts, heading }: Props) {
  if (!posts?.length) return null;

  const [featured, ...rest] = posts;

  return (
    <section id="blog" className="py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <h2 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl font-bold text-foreground">{heading || 'Blog'}</h2>
          <a
            href="/blog"
            className="text-sm text-primary hover:text-secondary transition-colors font-medium"
          >
            View all posts →
          </a>
        </div>

        {/* Featured post — large */}
        <a
          href={`/blog/${featured.slug.current}`}
          className="group block mb-10"
          aria-label={`Read: ${featured.title}`}
        >
          <div className="flex flex-col md:flex-row gap-6">
            {featured.coverImage && (
              <div className="md:w-1/2 overflow-hidden rounded">
                <Image
                  src={urlFor(featured.coverImage).width(600).height(340).url()}
                  alt={featured.title}
                  width={600}
                  height={340}
                  className="w-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
              </div>
            )}
            <div className={featured.coverImage ? "md:w-1/2 flex flex-col justify-center" : "w-full"}>
              <time className="text-xs text-muted" dateTime={featured.publishedAt}>
                {formatDate(featured.publishedAt)}
              </time>
              <h3 className="font-[family-name:var(--font-serif)] text-2xl font-semibold mt-2 group-hover:text-primary transition-colors">
                {featured.title}
              </h3>
              {featured.excerpt && (
                <p className="text-muted text-sm mt-3 line-clamp-3">{featured.excerpt}</p>
              )}
            </div>
          </div>
        </a>

        {/* Remaining posts — compact grid */}
        {rest.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {rest.map((post) => (
              <a
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="group block py-4 border-t border-border"
                aria-label={`Read: ${post.title}`}
              >
                <time className="text-xs text-muted" dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                <h3 className="font-[family-name:var(--font-serif)] text-lg font-semibold mt-1 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-muted text-sm mt-1 line-clamp-2">{post.excerpt}</p>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
