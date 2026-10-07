import type { ReactNode } from "react";

/**
 * Page body with the short inquiry form beside it.
 *
 * On desktop the form sits in a right-hand column that stays in view while the text scrolls,
 * so it is there whenever the reader decides. It is capped at the viewport height and scrolls
 * inside itself on short screens, so nothing in it is ever cut off. On mobile there is no room
 * beside the text, so the column drops below the article like before.
 */
export default function InquiryLayout({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  if (!aside) return <article className="mx-auto max-w-3xl">{children}</article>;

  return (
    <div className="mx-auto grid max-w-3xl gap-16 lg:max-w-6xl lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <article className="min-w-0">{children}</article>
      {/* Tightened on desktop (shorter message box, smaller heading) so the whole card fits a
          768px-tall laptop screen next to the text. top-28 leaves room for the language pill. */}
      <aside className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:[&_form]:mt-5 lg:[&_h2]:text-2xl lg:[&_textarea]:h-24">
        {aside}
      </aside>
    </div>
  );
}
