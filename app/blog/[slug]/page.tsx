import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import { getPostBySlug, getPostSlugs, getPageContent, getSettings } from "@/sanity/lib/queries";
import { portableTextComponents } from "@/lib/portableText";
import { urlFor } from "@/sanity/lib/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { absoluteUrl, breadcrumbJsonLd, buildSeoMetadata, jsonLdScript, personJsonLd } from "@/lib/seo";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((s) => ({ slug: s.slug.current }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found", alternates: { canonical: `/blog/${slug}` } };
  const metadata = await buildSeoMetadata({
    title: post.title,
    description: post.excerpt || post.title,
    path: `/blog/${slug}`,
    image: post.coverImage,
    openGraphType: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post._updatedAt || post.publishedAt,
  });

  return {
    ...metadata,
    keywords: post.tags,
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function estimateReadTime(body: PortableTextBlock[]): number {
  const text = body
    .filter((b) => b._type === "block")
    .map((b) => (b.children as Array<{ text?: string }> | undefined)?.map((c) => c.text).join("") || "")
    .join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, pageContent, settings] = await Promise.all([getPostBySlug(slug), getPageContent(), getSettings()]);
  if (!post) notFound();

  const readTime = post.body ? estimateReadTime(post.body) : null;
  const canonicalPath = `/blog/${slug}`;
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.coverImage && {
      image: urlFor(post.coverImage).width(1200).height(630).url(),
    }),
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post.publishedAt,
    author: personJsonLd,
    publisher: personJsonLd,
    mainEntityOfPage: absoluteUrl(canonicalPath),
  };

  return (
    <>
      {jsonLdScript(blogPostingJsonLd)}
      {jsonLdScript(breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path: canonicalPath },
      ]))}
      <Navbar navItems={pageContent?.navItems} siteName={settings?.siteName} showBlog={settings?.showBlog} />
      <main id="main-content" className="pt-24 pb-16 px-6">
        <article className="max-w-3xl mx-auto">
          <a
            href="/blog"
            className="text-sm text-muted hover:text-primary transition-colors mb-8 inline-block"
          >
            ← Back to blog
          </a>

          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <time className="text-sm text-muted" dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              {readTime && (
                <>
                  <span className="text-border">·</span>
                  <span className="text-sm text-muted">{readTime} min read</span>
                </>
              )}
              {post.categories && post.categories.length > 0 && (
                <>
                  <span className="text-border">·</span>
                  <div className="flex gap-2">
                    {post.categories.map((cat) => (
                      <a
                        key={cat._id}
                        href={`/blog/category/${cat.slug.current}`}
                        className="text-xs bg-surface text-muted px-2.5 py-0.5 rounded border border-border hover:border-primary transition-colors"
                      >
                        {cat.title}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>

            <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl font-bold mb-4 leading-tight text-foreground">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg text-muted">{post.excerpt}</p>
            )}
          </header>

          {post.coverImage && (
            <div className="mb-10 rounded overflow-hidden border border-border">
              <Image
                src={urlFor(post.coverImage).width(1200).height(630).url()}
                alt={post.title}
                width={1200}
                height={630}
                className="w-full object-cover"
                priority
              />
            </div>
          )}

          {post.body && (
            <div className="prose-editorial text-base leading-relaxed">
              <PortableText value={post.body} components={portableTextComponents} />
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-surface text-muted px-3 py-1.5 rounded border border-border"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer footerTagline={pageContent?.footerTagline} siteName={settings?.siteName} navItems={pageContent?.navItems} showBlog={settings?.showBlog} />
    </>
  );
}
