import {
  getAbout,
  getSkills,
  getExperience,
  getProjects,
  getContact,
  getCertifications,
  getHomelabPage,
  getFeaturedPosts,
  getPageContent,
  getSettings,
} from "@/sanity/lib/queries";
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
  const [about, skills, experience, projects, contact, certifications, homelabPage, featuredPosts, pageContent, settings] =
    await Promise.all([
      getAbout(),
      getSkills(),
      getExperience(),
      getProjects(),
      getContact(),
      getCertifications(),
      getHomelabPage(),
      getFeaturedPosts(),
      getPageContent(),
      getSettings(),
    ]);

  return (
    <>
      <ScrollProgress />
      <Navbar navItems={pageContent?.navItems} siteName={settings?.siteName} showBlog={settings?.showBlog} />
      <main id="main-content">
        <Hero about={about} />
        <About about={about} heading={pageContent?.aboutHeading} />
        <Experience experience={experience} heading={pageContent?.experienceHeading} resumeUrl={about?.resumeFile?.asset?.url} />
        <Skills skills={skills} heading={pageContent?.skillsHeading} />
        <Projects projects={projects} heading={pageContent?.projectsHeading} intro={pageContent?.projectsIntro} />
        <Homelab heading={pageContent?.homelabHeading} subtitle={pageContent?.homelabSubtitle} stats={homelabPage?.stats} />
        <Certifications certifications={certifications} heading={pageContent?.certificationsHeading} />
        {settings?.showBlog !== false && <BlogPreview posts={featuredPosts} heading={pageContent?.blogPreviewHeading} showBlog={settings?.showBlog} />}
        <Contact contact={contact} heading={pageContent?.contactSectionHeading} tagline={pageContent?.contactSectionTagline} />
      </main>
      <Footer contact={contact} footerTagline={pageContent?.footerTagline} siteName={settings?.siteName} navItems={pageContent?.navItems} showBlog={settings?.showBlog} />
      <BackToTop />
      <FloatingCTA floatingCtaText={pageContent?.floatingCtaText} />
      <SectionDots />
    </>
  );
}
