import type { PortableTextBlock } from "@portabletext/types";

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface SiteSettings {
  _id: string;
  _type: "siteSettings";
  siteName?: string;
  siteDescription?: string;
  ogImage?: SanityImage;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textColor?: string;
  textSecondaryColor?: string;
}

export interface About {
  _id: string;
  _type: "about";
  heading?: string;
  tagline?: string;
  roles?: string[];
  body?: PortableTextBlock[];
  profileImage?: SanityImage;
  resumeFile?: {
    asset: {
      _ref: string;
      url: string;
    };
  };
}

export interface Skill {
  _id: string;
  _type: "skill";
  name: string;
  category: string;
  icon?: SanityImage;
  proficiency?: number;
  order?: number;
}

export interface Experience {
  _id: string;
  _type: "experience";
  company: string;
  companyLogo?: SanityImage;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: PortableTextBlock[];
  technologies?: Skill[];
  order?: number;
}

export interface Project {
  _id: string;
  _type: "project";
  title: string;
  slug: { current: string };
  summary?: string;
  description?: PortableTextBlock[];
  image?: SanityImage;
  technologies?: Skill[];
  githubUrl?: string;
  liveUrl?: string;
  problem?: string;
  approach?: string;
  outcome?: string;
  clientName?: string;
  testimonial?: string;
  featured?: boolean;
  order?: number;
}

export interface ContactInfo {
  _id: string;
  _type: "contactInfo";
  email?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  mastodon?: string;
  upworkUrl?: string;
  freelancerUrl?: string;
  location?: string;
  availableForWork?: boolean;
  contactFormEnabled?: boolean;
}

export interface FormField {
  _key: string;
  label: string;
  name: string;
  type: "text" | "email" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface ContactForm {
  _id: string;
  _type: "contactForm";
  name: string;
  slug: { current: string };
  heading?: string;
  description?: string;
  fields?: FormField[];
  submitText?: string;
  successMessage?: string;
}

export interface FAQ {
  _id: string;
  _type: "faq";
  question: string;
  answer: string;
  order?: number;
}

export interface PageContent {
  _id: string;
  _type: "pageContent";
  heroEyebrow?: string;
  heroTagline?: string;
  heroCta1Text?: string;
  heroCta1Link?: string;
  heroCta2Text?: string;
  heroCta2Link?: string;
  contactHeading?: string;
  contactIntro?: string;
  hireHeading?: string;
  hireDescription?: string;
  hireBullets?: string[];
  hireButtonText?: string;
  responseTime?: string;
  helloHeading?: string;
  helloDescription?: string;
  helloButtonText?: string;
  servicesHeading?: string;
  servicesIntro?: string;
  servicesCta?: string;
  servicesCtaDescription?: string;
}

export interface Service {
  _id: string;
  _type: "service";
  title: string;
  slug: { current: string };
  summary?: string;
  description?: PortableTextBlock[];
  icon?: string;
  featured?: boolean;
  order?: number;
}

export interface Category {
  _id: string;
  _type: "category";
  title: string;
  slug: { current: string };
  description?: string;
}

export interface Post {
  _id: string;
  _type: "post";
  title: string;
  slug: { current: string };
  excerpt?: string;
  coverImage?: SanityImage;
  body?: PortableTextBlock[];
  categories?: Category[];
  tags?: string[];
  publishedAt: string;
  featured?: boolean;
}

export interface Certification {
  _id: string;
  _type: "certification";
  name: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialUrl?: string;
  badge?: SanityImage;
  order?: number;
}

export interface HomelabService {
  _id: string;
  _type: "homelabService";
  name: string;
  description?: string;
  category?: string;
  icon?: SanityImage;
  selfHosted?: boolean;
  url?: string;
  order?: number;
}

export interface FormField {
  _key: string;
  label: string;
  name: string;
  type: "text" | "email" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface ContactForm {
  _id: string;
  _type: "contactForm";
  name: string;
  slug: { current: string };
  heading?: string;
  description?: string;
  fields?: FormField[];
  submitText?: string;
  successMessage?: string;
}
