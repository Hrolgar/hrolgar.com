import type { Metadata } from "next";
import type { Locale } from "@/sanity/locale";
import { DEFAULT_LOCALE } from "@/sanity/locale";
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
        <Hero about={about} />
        {/* Work comes before the bio on purpose. Measured in Umami: of 57 people who
            landed on the home page, 11 reached /projects and 5 reached /contact. With
            About, Experience and Skills stacked above it, the work was the fifth thing
            a visitor scrolled to, which is backwards for someone deciding who to hire. */}
        <Projects projects={projects} heading={pageContent?.projectsHeading} intro={pageContent?.projectsIntro} locale={locale} />
        <About about={about} heading={pageContent?.aboutHeading} />
        <Experience experience={experience} heading={pageContent?.experienceHeading} resumeUrl={about?.resumeFile?.asset?.url} locale={locale} />
        <Skills skills={skills} heading={pageContent?.skillsHeading} locale={locale} />
        <Homelab heading={pageContent?.homelabHeading} subtitle={pageContent?.homelabSubtitle} stats={homelabPage?.stats} locale={locale} />
        <Certifications certifications={certifications} heading={pageContent?.certificationsHeading} />
        {settings?.showBlog !== false && <BlogPreview posts={featuredPosts.length > 0 ? featuredPosts : recentPosts} heading={pageContent?.blogPreviewHeading} showBlog={settings?.showBlog} locale={locale} />}
        <Contact contact={contact} heading={pageContent?.contactSectionHeading} tagline={pageContent?.contactSectionTagline} locale={locale} />
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
