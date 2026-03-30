import {
  getAbout,
  getSkills,
  getExperience,
  getProjects,
  getContact,
  getCertifications,
  getHomelabServices,
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
  const [about, skills, experience, projects, contact, certifications, homelabServices, featuredPosts, pageContent, settings] =
    await Promise.all([
      getAbout(),
      getSkills(),
      getExperience(),
      getProjects(),
      getContact(),
      getCertifications(),
      getHomelabServices(),
      getFeaturedPosts(),
      getPageContent(),
      getSettings(),
    ]);

  return (
    <>
      <ScrollProgress />
      <Navbar navItems={pageContent?.navItems} siteName={settings?.siteName} />
      <main id="main-content">
        <Hero about={about} />
        <About about={about} heading={pageContent?.aboutHeading} />
        <Experience experience={experience} heading={pageContent?.experienceHeading} />
        <Skills skills={skills} heading={pageContent?.skillsHeading} />
        <Projects projects={projects} heading={pageContent?.projectsHeading} />
        <Homelab services={homelabServices} heading={pageContent?.homelabHeading} subtitle={pageContent?.homelabSubtitle} />
        <Certifications certifications={certifications} heading={pageContent?.certificationsHeading} />
        <BlogPreview posts={featuredPosts} heading={pageContent?.blogPreviewHeading} />
        <Contact contact={contact} heading={pageContent?.contactSectionHeading} tagline={pageContent?.contactSectionTagline} />
      </main>
      <Footer contact={contact} footerTagline={pageContent?.footerTagline} siteName={settings?.siteName} />
      <BackToTop />
      <FloatingCTA floatingCtaText={pageContent?.floatingCtaText} />
      <SectionDots />
    </>
  );
}
