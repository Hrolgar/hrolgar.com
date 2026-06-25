import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ContactPageClient from "@/components/ContactPageClient";
import { getContact, getFAQs, getPageContent, getServices, getContactForms, getSettings } from "@/sanity/lib/queries";
import type { FAQ } from "@/sanity/types";
import { breadcrumbJsonLd, buildSeoMetadata, jsonLdScript } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata({
    title: "Contact Helgi About Backend & Integration Work",
    description: "Get in touch about backend development, .NET APIs, integrations, infrastructure automation, or a messy system that needs a practical fix.",
    path: "/contact",
  });
}

const defaultFAQs: FAQ[] = [
  {
    _id: "default-1",
    _type: "faq",
    question: "What's your availability?",
    answer: "I take on 1-2 freelance projects at a time alongside my full-time role. Current availability is shown above.",
  },
  {
    _id: "default-2",
    _type: "faq",
    question: "What are your rates?",
    answer: "Rates depend on project scope and complexity. For a quick estimate, reach out with your project details.",
  },
  {
    _id: "default-3",
    _type: "faq",
    question: "What timezone are you in?",
    answer: "I'm based in Ålesund, Norway (CET/CEST). I work with clients worldwide and am flexible with async communication.",
  },
  {
    _id: "default-4",
    _type: "faq",
    question: "Do you do frontend work?",
    answer: "My focus is backend and infrastructure. For projects that need frontend work, I can coordinate with frontend specialists.",
  },
];

export default async function ContactPage() {
  const [contact, services, pageContent, faqs, forms, settings] = await Promise.all([
    getContact(),
    getServices(),
    getPageContent(),
    getFAQs(),
    getContactForms(),
    getSettings(),
  ]);

  return (
    <>
      {jsonLdScript(breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ]))}
      <Navbar navItems={pageContent?.navItems} siteName={settings?.siteName} showBlog={settings?.showBlog} />
      <ContactPageClient
        contact={contact}
        services={services}
        pageContent={pageContent}
        faqs={faqs}
        forms={forms}
        defaultFAQs={defaultFAQs}
      />
      <Footer contact={contact} footerTagline={pageContent?.footerTagline} siteName={settings?.siteName} navItems={pageContent?.navItems} showBlog={settings?.showBlog} />
    </>
  );
}
