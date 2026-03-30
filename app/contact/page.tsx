import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ContactPageClient from "@/components/ContactPageClient";
import { getContact, getFAQs, getPageContent, getServices, getContactForms, getSettings } from "@/sanity/lib/queries";
import type { FAQ } from "@/sanity/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Let's Talk",
  description: "Start a project inquiry or get in touch with Hrolgar.",
};

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
      <Navbar navItems={pageContent?.navItems} siteName={settings?.siteName} />
      <ContactPageClient
        contact={contact}
        services={services}
        pageContent={pageContent}
        faqs={faqs}
        forms={forms}
        defaultFAQs={defaultFAQs}
      />
      <Footer contact={contact} footerTagline={pageContent?.footerTagline} siteName={settings?.siteName} />
    </>
  );
}
