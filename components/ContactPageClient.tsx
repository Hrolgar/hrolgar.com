"use client";

import { useEffect, useState } from "react";
import type { ContactInfo, Service, PageContent, FAQ, ContactForm } from "@/sanity/types";
import ContactFormModal from "@/components/ContactFormModal";

interface Props {
  contact: ContactInfo | null;
  services: Service[];
  pageContent: PageContent | null;
  faqs: FAQ[];
  forms: ContactForm[];
  defaultFAQs: FAQ[];
}

const socialIcons: Record<string, string> = {
  github: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
  linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};

const iconMap: Record<string, string> = {
  api: "⟷",
  backend: "⚙",
  automation: "▶",
};

function useIsDesktop(breakpoint = 768) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const update = (event?: MediaQueryListEvent) => {
      setIsDesktop(event ? event.matches : mediaQuery.matches);
    };

    update();
    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, [breakpoint]);

  return isDesktop;
}

export default function ContactPageClient({
  contact,
  services,
  pageContent,
  faqs,
  forms,
  defaultFAQs,
}: Props) {
  const [openFormSlug, setOpenFormSlug] = useState<string | null>(null);
  const isDesktop = useIsDesktop();

  const projectInquiryForm = forms.find((f) => f.slug?.current === "project-inquiry");
  const generalContactForm = forms.find((f) => f.slug?.current === "general-contact");

  const projectInquiryHref = contact?.email
    ? `mailto:${contact.email}?subject=${encodeURIComponent("Project Inquiry")}&body=${encodeURIComponent("Hi Helgi,\n\nProject:\nTimeline:\nBudget range:\nTechnical details:\n")}`
    : null;
  const helloHref = contact?.email
    ? `mailto:${contact.email}?subject=${encodeURIComponent("Hello")}`
    : null;

  const socials = [
    { key: "github", url: contact?.github, label: "GitHub" },
    { key: "linkedin", url: contact?.linkedin, label: "LinkedIn" },
    { key: "upwork", url: contact?.upworkUrl, label: "Upwork" },
    { key: "freelancer", url: contact?.freelancerUrl, label: "Freelancer" },
  ].filter((social) => social.url);

  const contactHeading = pageContent?.contactHeading || "Let's Talk";
  const contactIntro = pageContent?.contactIntro || "Whether you're planning a backend-heavy build, need help untangling an integration, or just want to start a conversation, this is the best place to reach me.";
  const hireHeading = pageContent?.hireHeading || "Start a Project";
  const hireDescription = pageContent?.hireDescription || "Tell me about what you're building. I find it helpful to know:";
  const hireBullets = pageContent?.hireBullets || ["What problem you're solving", "Your timeline and budget range", "Any technical constraints"];
  const hireButtonText = pageContent?.hireButtonText || "Send a Project Inquiry";
  const responseTime = pageContent?.responseTime || "Typically responds within 24 hours";
  const helloHeading = pageContent?.helloHeading || "Say Hello";
  const helloDescription = pageContent?.helloDescription || "Not hiring? I'm happy to chat about tech, open source, homelabbing, or interesting ideas.";
  const helloButtonText = pageContent?.helloButtonText || "Send a Message";

  const displayFAQs = faqs.length > 0 ? faqs : defaultFAQs;
  const openForm = forms.find((f) => f.slug?.current === openFormSlug);
  const formVariant = isDesktop ? "desktop" : "inline";

  const toggleForm = (slug: string) => {
    setOpenFormSlug((current) => {
      if (!isDesktop && current === slug) return null;
      return slug;
    });
  };

  return (
    <>
      <main id="main-content" className="px-6 pb-16 pt-24 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <section className="border-b border-border pb-12 md:pb-16">
            <p className="mb-5 text-sm uppercase tracking-[0.24em] text-primary">
              Contact
            </p>
            <h1 className="max-w-[10ch] font-[family-name:var(--font-serif)] text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
              {contactHeading}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
              {contactIntro}
            </p>
          </section>

          {services.length > 0 && (
            <section className="py-12 md:py-16 border-b border-border">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted mb-6">
                What I can help with
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {services.map((service) => (
                  <a
                    key={service._id}
                    href={`/services/${service.slug?.current}`}
                    className="group flex items-start gap-4 rounded-[calc(var(--radius)*2)] border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary"
                  >
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-lg text-accent">
                      {iconMap[service.icon || ""] || "•"}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted leading-relaxed line-clamp-2">
                        {service.summary}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          <section className="grid gap-6 py-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:py-16">
            <article className="rounded-[calc(var(--radius)*2)] border border-accent/30 bg-[color:color-mix(in_srgb,var(--color-surface)_78%,black)] p-8 md:p-10">
              <p className="text-sm uppercase tracking-[0.24em] text-accent">Hire flow</p>
              <h2 className="mt-4 font-[family-name:var(--font-serif)] text-3xl font-bold text-foreground md:text-4xl">
                {hireHeading}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
                {hireDescription}
              </p>

              <ul className="mt-6 space-y-4 text-sm leading-relaxed text-foreground md:text-base">
                {hireBullets.map((bullet, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-2 h-2.5 w-2.5 flex-none rounded-full bg-accent" aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              {projectInquiryForm ? (
                <button
                  type="button"
                  onClick={() => toggleForm("project-inquiry")}
                  aria-expanded={openFormSlug === "project-inquiry"}
                  aria-controls="contact-form-project-inquiry"
                  className="mt-8 inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-accent px-8 py-3 text-sm font-semibold text-bg transition-colors hover:bg-[color:color-mix(in_srgb,var(--color-accent)_88%,white)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {hireButtonText}
                </button>
              ) : projectInquiryHref ? (
                <a
                  href={projectInquiryHref}
                  className="mt-8 inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-accent px-8 py-3 text-sm font-semibold text-bg transition-colors hover:bg-[color:color-mix(in_srgb,var(--color-accent)_88%,white)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {hireButtonText}
                </a>
              ) : null}

              <p className="mt-5 text-sm text-muted">{responseTime}</p>

              {contact?.availableForWork && (
                <span className="mt-4 inline-flex min-h-11 items-center gap-3 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_6px_rgba(224,122,95,0.12)]" />
                  Available for freelance work
                </span>
              )}

              {!isDesktop && projectInquiryForm && openFormSlug === "project-inquiry" ? (
                <div id="contact-form-project-inquiry">
                  <ContactFormModal
                    form={projectInquiryForm}
                    isOpen={true}
                    variant={formVariant}
                    onClose={() => setOpenFormSlug(null)}
                  />
                </div>
              ) : null}
            </article>

            <article className="rounded-[calc(var(--radius)*2)] border border-border bg-surface p-8 md:p-10">
              <p className="text-sm uppercase tracking-[0.24em] text-primary">General contact</p>
              <h2 className="mt-4 font-[family-name:var(--font-serif)] text-3xl font-bold text-foreground">
                {helloHeading}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                {helloDescription}
              </p>

              {generalContactForm ? (
                <button
                  type="button"
                  onClick={() => toggleForm("general-contact")}
                  aria-expanded={openFormSlug === "general-contact"}
                  aria-controls="contact-form-general-contact"
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {helloButtonText}
                </button>
              ) : helloHref ? (
                <a
                  href={helloHref}
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {helloButtonText}
                </a>
              ) : null}

              {socials.length > 0 && (
                <div className="mt-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                    Find me elsewhere
                  </p>
                  <div className="mt-4 space-y-3">
                    {socials.map((social) => (
                      <a
                        key={social.key}
                        href={social.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-11 items-center justify-between rounded-[var(--radius)] border border-border px-4 py-3 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
                        aria-label={social.label}
                      >
                        <span>{social.label}</span>
                        {socialIcons[social.key] ? (
                          <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d={socialIcons[social.key]} />
                          </svg>
                        ) : (
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                            Profile
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {!isDesktop && generalContactForm && openFormSlug === "general-contact" ? (
                <div id="contact-form-general-contact">
                  <ContactFormModal
                    form={generalContactForm}
                    isOpen={true}
                    variant={formVariant}
                    onClose={() => setOpenFormSlug(null)}
                  />
                </div>
              ) : null}
            </article>
          </section>

          <section className="rounded-[calc(var(--radius)*2)] border border-border bg-[color:color-mix(in_srgb,var(--color-surface)_84%,black)] p-8 md:p-10">
            <p className="text-sm uppercase tracking-[0.24em] text-primary">FAQ</p>
            <h2 className="mt-4 font-[family-name:var(--font-serif)] text-3xl font-bold text-foreground md:text-4xl">
              Common Questions
            </h2>

            <div className="mt-8 divide-y divide-border">
              {displayFAQs.map((faq) => (
                <div key={faq._id} className="py-6">
                  <h3 className="font-[family-name:var(--font-serif)] text-2xl font-semibold text-foreground">
                    {faq.question}
                  </h3>
                  <p className="mt-3 max-w-3xl leading-relaxed text-muted">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {isDesktop && openForm && (
        <ContactFormModal
          form={openForm}
          isOpen={true}
          variant={formVariant}
          onClose={() => setOpenFormSlug(null)}
        />
      )}
    </>
  );
}
