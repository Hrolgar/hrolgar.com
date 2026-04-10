import type { About } from "@/sanity/types";
import RotatingText from "./RotatingText";
import ShaderBackground from "./ShaderBackground";

interface Props {
  about: About | null;
}

export default function Hero({ about }: Props) {
  const roles = about?.roles;
  const staticEyebrow = roles?.[0] || "Freelance Backend Engineer";
  const tagline = about?.tagline || "I build robust integrations, APIs, and backend systems that just work.";
  const cta1Text = about?.heroCta1Text || "See my work";
  const cta1Link = about?.heroCta1Link || "/#projects";
  const cta2Text = about?.heroCta2Text || "Get in touch";
  const cta2Link = about?.heroCta2Link || "/contact";

  return (
    <section className="relative min-h-screen px-6 pt-28 pb-16 md:pt-36 md:pb-24 flex items-center overflow-hidden">
      <ShaderBackground
        src="/shaders/generative-tree.html"
        className="hidden md:block !left-auto !right-0 !w-[55%]"
      />
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <p className="animate-fade-in-up text-sm uppercase tracking-[0.24em] text-primary mb-5">
          {roles && roles.length > 1 ? (
            <RotatingText texts={roles} />
          ) : (
            staticEyebrow
          )}
        </p>
        <h1 className="animate-fade-in-up animate-delay-120 font-[family-name:var(--font-serif)] text-5xl sm:text-6xl md:text-8xl font-bold text-foreground leading-none tracking-tight">
          {about?.heading || "Hrolgar"}
        </h1>
        <p className="animate-fade-in-up animate-delay-240 mt-6 max-w-xl text-lg md:text-xl leading-relaxed text-muted">
          {tagline}
        </p>
        <div className="animate-fade-in-up animate-delay-360 mt-10 flex flex-col sm:flex-row gap-4">
          <a
            href={cta1Link}
            className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-accent px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-[color:color-mix(in_srgb,var(--color-accent)_88%,white)]"
          >
            {cta1Text}
          </a>
          <a
            href={cta2Link}
            className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {cta2Text}
          </a>
        </div>
      </div>
    </section>
  );
}
