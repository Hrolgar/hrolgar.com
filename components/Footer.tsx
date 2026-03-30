import type { ContactInfo } from "@/sanity/types";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const githubPath = "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z";
const linkedinPath = "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

interface Props {
  contact?: ContactInfo | null;
  footerTagline?: string | null;
  siteName?: string | null;
}

export default function Footer({ contact, footerTagline, siteName }: Props) {
  const socials = [
    { key: "github", url: contact?.github, label: "GitHub", iconPath: githubPath },
    { key: "linkedin", url: contact?.linkedin, label: "LinkedIn", iconPath: linkedinPath },
    { key: "upwork", url: contact?.upworkUrl, label: "Upwork" },
    { key: "freelancer", url: contact?.freelancerUrl, label: "Freelancer" },
  ].filter((social) => social.url);

  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(180px,0.8fr)_minmax(180px,0.8fr)]">
        <div>
          <a
            href="/"
            className="font-[family-name:var(--font-serif)] text-2xl font-semibold text-foreground"
          >
            {siteName || "Hrolgar"}
          </a>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            {footerTagline || 'Freelance backend engineering for integrations, APIs, and reliable systems.'}
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Navigate</p>
          <ul className="mt-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {socials.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Social</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {socials.map((social) => (
                <a
                  key={social.key}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius)] border border-border px-4 py-3 text-sm text-muted transition-all duration-150 hover:border-primary hover:text-primary hover:scale-110"
                  aria-label={social.label}
                >
                  <span>{social.label}</span>
                  {social.iconPath && (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.iconPath} />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted md:col-span-3 pt-6 border-t border-border">
          &copy; {new Date().getFullYear()} Ullrhome
        </p>
      </div>
    </footer>
  );
}
