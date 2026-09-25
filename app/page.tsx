import type { Metadata } from "next";
import type { Locale } from "@/sanity/locale";
import { DEFAULT_LOCALE } from "@/sanity/locale";
import { resolveHomeSections } from "@/sanity/homeSections";
import { buildSeoMetadata , withAlternates} from "@/lib/seo";
import {
  getAbout,
  getSkills,
  getExperience,
  getProjects,
  getContact,
  getCertifications,
  getHomelabPage,
  getFeaturedPosts,
  getPosts,
  getPageContent,
  getSettings,
} from "@/sanity/lib/queries";

const HOMEPAGE_TITLE = "Helgi Skjortnes: Freelance .NET & Integrations Engineer";
const HOMEPAGE_DESCRIPTION =
  "Freelance .NET and systems-integration engineer. Backend systems, APIs, data platforms and the infrastructure to run them. C#, ASP.NET Core, Postgres.";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await buildSeoMetadata({
    title: { absolute: HOMEPAGE_TITLE },
    ogTitle: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    path: "/",
  });
  return withAlternates(meta, "/");
}
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Homelab from "@/components/Homelab";
import BlogPreview from "@/components/BlogPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import FloatingCTA from "@/components/FloatingCTA";
import ScrollProgress from "@/components/ScrollProgress";
import SectionDots from "@/components/SectionDots";

export const revalidate = 3600;

export async function HomeBody({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const [about, skills, experience, projects, contact, certifications, homelabPage, featuredPosts, recentPosts, pageContent, settings] =
    await Promise.all([
      getAbout(locale),
      getSkills(),
      getExperience(locale),
      getProjects(locale),
      getContact(locale),
      getCertifications(),
      getHomelabPage(),
      getFeaturedPosts(),
      getPosts(3),
      getPageContent(locale),
      getSettings(),
    ]);

  return (
    <>
      <ScrollProgress />
      <Navbar navItems={pageContent?.navItems} siteName={settings?.siteName} showBlog={settings?.showBlog} locale={locale} />
      <main id="main-content">
        {resolveHomeSections(pageContent?.homeSections).map((key) => {
          switch (key) {
            case "hero":
              return <Hero key={key} about={about} />;
            case "about":
              return <About key={key} about={about} heading={pageContent?.aboutHeading} />;
            case "projects":
              return <Projects key={key} projects={projects} heading={pageContent?.projectsHeading} intro={pageContent?.projectsIntro} locale={locale} />;
            case "experience":
              return <Experience key={key} experience={experience} heading={pageContent?.experienceHeading} resumeUrl={about?.resumeFile?.asset?.url} locale={locale} />;
            case "skills":
              return <Skills key={key} skills={skills} heading={pageContent?.skillsHeading} locale={locale} />;
            case "homelab":
              return <Homelab key={key} heading={pageContent?.homelabHeading} subtitle={pageContent?.homelabSubtitle} stats={homelabPage?.stats} locale={locale} />;
            case "certifications":
              return <Certifications key={key} certifications={certifications} heading={pageContent?.certificationsHeading} />;
            case "blog":
              return settings?.showBlog !== false ? <BlogPreview key={key} posts={featuredPosts.length > 0 ? featuredPosts : recentPosts} heading={pageContent?.blogPreviewHeading} showBlog={settings?.showBlog} locale={locale} /> : null;
            case "contact":
              return <Contact key={key} contact={contact} heading={pageContent?.contactSectionHeading} tagline={pageContent?.contactSectionTagline} locale={locale} />;
          }
        })}
      </main>
      <Footer contact={contact} footerTagline={pageContent?.footerTagline} siteName={settings?.siteName} navItems={pageContent?.navItems} showBlog={settings?.showBlog} locale={locale} />
      <BackToTop />
      <FloatingCTA floatingCtaText={pageContent?.floatingCtaText} locale={locale} />
      <SectionDots />
    </>
  );
}

export default async function Home() {
  return <HomeBody locale="en" />;
}
