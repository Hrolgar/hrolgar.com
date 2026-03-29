import type { ContactInfo } from "@/sanity/types";

interface Props {
  contact: ContactInfo | null;
}

export default function Contact({ contact }: Props) {
  if (!contact) return null;

  return (
    <section id="contact" className="bg-surface px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        {contact.availableForWork && (
          <span className="mb-8 inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
            <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_6px_rgba(224,122,95,0.12)]" />
            Available for freelance work
          </span>
        )}
        <h2 className="font-[family-name:var(--font-serif)] text-4xl font-bold text-foreground md:text-5xl">
          Let&apos;s Work Together
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          Have a project in mind? I&apos;d love to hear about it.
        </p>
        <a
          href="/contact"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-accent px-8 py-3 text-sm font-semibold text-bg transition-colors hover:bg-[color:color-mix(in_srgb,var(--color-accent)_88%,white)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Get in touch
        </a>
      </div>
    </section>
  );
}
