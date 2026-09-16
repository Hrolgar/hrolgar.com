import type { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo";
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
  return buildSeoMetadata({
    title: { absolute: HOMEPAGE_TITLE },
    ogTitle: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    path: "/",
  });
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

export default async function Home() {
  const [about, skills, experience, projects, contact, certifications, homelabPage, featuredPosts, recentPosts, pageContent, settings] =
    await Promise.all([
      getAbout(),
      getSkills(),
      getExperience(),
      getProjects(),
      getContact(),
      getCertifications(),
      getHomelabPage(),
      getFeaturedPosts(),
      getPosts(3),
      getPageContent(),
      getSettings(),
    ]);

  return (
    <>
      <ScrollProgress />
      <Navbar navItems={pageContent?.navItems} siteName={settings?.siteName} showBlog={settings?.showBlog} />
      <main id="main-content">
        <Hero about={about} />
        {/* Work comes before the bio on purpose. Measured in Umami: of 57 people who
            landed on the home page, 11 reached /projects and 5 reached /contact. With
            About, Experience and Skills stacked above it, the work was the fifth thing
            a visitor scrolled to, which is backwards for someone deciding who to hire. */}
        <Projects projects={projects} heading={pageContent?.projectsHeading} intro={pageContent?.projectsIntro} />
        <About about={about} heading={pageContent?.aboutHeading} />
        <Experience experience={experience} heading={pageContent?.experienceHeading} resumeUrl={about?.resumeFile?.asset?.url} />
        <Skills skills={skills} heading={pageContent?.skillsHeading} />
        <Homelab heading={pageContent?.homelabHeading} subtitle={pageContent?.homelabSubtitle} stats={homelabPage?.stats} />
        <Certifications certifications={certifications} heading={pageContent?.certificationsHeading} />
        {settings?.showBlog !== false && <BlogPreview posts={featuredPosts.length > 0 ? featuredPosts : recentPosts} heading={pageContent?.blogPreviewHeading} showBlog={settings?.showBlog} />}
        <Contact contact={contact} heading={pageContent?.contactSectionHeading} tagline={pageContent?.contactSectionTagline} />
      </main>
      <Footer contact={contact} footerTagline={pageContent?.footerTagline} siteName={settings?.siteName} navItems={pageContent?.navItems} showBlog={settings?.showBlog} />
      <BackToTop />
      <FloatingCTA floatingCtaText={pageContent?.floatingCtaText} />
      <SectionDots />
    </>
  );
}
