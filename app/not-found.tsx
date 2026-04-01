import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPageContent, getSettings } from "@/sanity/lib/queries";

export default async function NotFound() {
  const [pageContent, settings] = await Promise.all([getPageContent(), getSettings()]);
  return (
    <>
      <Navbar navItems={pageContent?.navItems} siteName={settings?.siteName} />
      <main id="main-content" className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center animate-fade-in-up">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-4">
            Page not found
          </p>
          <h1 className="font-[family-name:var(--font-serif)] text-8xl md:text-9xl font-bold text-foreground mb-6">
            404
          </h1>
          <p className="text-base text-muted max-w-md mx-auto mb-10">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/"
              className="px-6 py-3 bg-primary text-white rounded font-medium hover:bg-secondary transition-colors"
            >
              Go Home
            </a>
            <a
              href="/blog"
              className="px-6 py-3 border border-primary text-primary rounded font-medium hover:bg-primary hover:text-white transition-colors"
            >
              Read Blog
            </a>
          </div>
        </div>
      </main>
      <Footer footerTagline={pageContent?.footerTagline} siteName={settings?.siteName} navItems={pageContent?.navItems} showBlog={settings?.showBlog} />
    </>
  );
}
