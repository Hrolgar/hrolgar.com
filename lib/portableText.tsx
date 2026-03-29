import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { PortableTextComponents } from "@portabletext/react";

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || "Image"}
            width={800}
            height={450}
            loading="lazy"
            className="w-full rounded border border-border"
          />
          {value.caption && (
            <figcaption className="text-center text-sm text-muted mt-3">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    code: ({ value }) => {
      if (!value?.code) return null;
      return (
        <pre className="my-6 p-4 bg-surface border border-border rounded overflow-x-auto">
          {value.language && (
            <div className="text-xs text-muted mb-2 font-[family-name:var(--font-mono)]">{value.language}</div>
          )}
          <code className="text-sm font-[family-name:var(--font-mono)] text-foreground">{value.code}</code>
        </pre>
      );
    },
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="text-primary hover:underline"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="text-accent bg-surface px-1.5 py-0.5 rounded text-[0.9em] font-[family-name:var(--font-mono)]">
        {children}
      </code>
    ),
  },
  block: {
    h2: ({ children }) => (
      <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-foreground mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-[family-name:var(--font-serif)] text-xl font-semibold text-foreground mt-8 mb-3">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-[family-name:var(--font-serif)] text-lg font-semibold text-foreground mt-6 mb-2">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 my-6 italic text-muted">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="text-muted leading-relaxed mb-4">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 my-4 text-muted">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 my-4 text-muted">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
};
