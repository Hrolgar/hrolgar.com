import { notFound } from "next/navigation";
import { getPostsByCategory, getCategories, getPageContent, getSettings } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug.current }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug.current === slug);
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.title} — Blog`,
    description: `Posts in ${category.title}`,
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [posts, categories, pageContent, settings] = await Promise.all([
    getPostsByCategory(slug),
    getCategories(),
    getPageContent(),
    getSettings(),
  ]);

  const category = categories.find((c) => c.slug.current === slug);
  if (!category) notFound();

  return (
    <>
      <Navbar navItems={pageContent?.navItems} siteName={settings?.siteName} />
      <main id="main-content" className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <a
              href="/blog"
              className="text-sm text-muted hover:text-primary transition-colors mb-4 inline-block"
            >
              ← All posts
            </a>
            <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl font-bold mb-2 text-foreground">
              {category.title}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            <a
              href="/blog"
              className="text-xs bg-surface text-muted px-3 py-1.5 rounded border border-border hover:text-foreground hover:border-primary transition-all"
            >
              All
            </a>
            {categories.map((cat) => (
              <a
                key={cat._id}
                href={`/blog/category/${cat.slug.current}`}
                className={`text-xs px-3 py-1.5 rounded font-medium ${
                  cat.slug.current === slug
                    ? "bg-primary/15 text-primary border border-transparent"
                    : "bg-surface text-muted border border-border hover:text-foreground hover:border-primary transition-all"
                }`}
              >
                {cat.title}
              </a>
            ))}
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted text-base">No posts in this category yet.</p>
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
                        loading="lazy"
                        className="w-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <time className="text-xs text-muted" dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                    <h2 className="font-[family-name:var(--font-serif)] text-lg font-semibold mt-2 mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted text-sm line-clamp-3">{post.excerpt}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer footerTagline={pageContent?.footerTagline} siteName={settings?.siteName} />
    </>
  );
}
