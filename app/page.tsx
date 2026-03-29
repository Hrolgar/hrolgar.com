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
  const [about, skills, experience, projects, contact, certifications, homelabServices, featuredPosts, pageContent] =
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
    ]);

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main-content">
        <Hero about={about} pageContent={pageContent} />
        <About about={about} />
        <Experience experience={experience} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Homelab services={homelabServices} />
        <Certifications certifications={certifications} />
        <BlogPreview posts={featuredPosts} />
        <Contact contact={contact} />
      </main>
      <Footer contact={contact} />
      <BackToTop />
      <FloatingCTA />
      <SectionDots />
    </>
  );
}
