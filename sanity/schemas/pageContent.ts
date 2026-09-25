import {defineArrayMember, defineField, defineType} from 'sanity'
import {DEFAULT_LOCALE} from '../locale'
import {localeRequired} from './localeFields'
import {HOME_SECTIONS} from '../homeSections'

export default defineType({
  name: 'pageContent',
  title: 'Page Content',
  type: 'document',
  groups: [
    {name: 'home', title: 'Home Page', default: true},
    {name: 'contact', title: 'Contact Page'},
    {name: 'services', title: 'Services Page'},
    {name: 'blog', title: 'Blog'},
    {name: 'navigation', title: 'Navigation'},
    {name: 'footer', title: 'Footer'},
    {name: 'sections', title: 'Section Headings'},
  ],
  fields: [
    defineField({
      name: 'homeSections',
      title: 'Home Page Sections',
      type: 'array',
      group: 'home',
      description:
        'The sections on the home page, top to bottom. Drag to reorder, switch "Show" off to hide one for now, or remove it. Headings are edited under Section Headings. An empty list shows every section in the default order.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'homeSection',
          fields: [
            defineField({
              name: 'section',
              title: 'Section',
              type: 'string',
              options: {list: HOME_SECTIONS.map((s) => ({title: s.title, value: s.value}))},
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'enabled', title: 'Show', type: 'boolean', initialValue: true}),
          ],
          preview: {
            select: {section: 'section', enabled: 'enabled'},
            prepare({section, enabled}) {
              const title = HOME_SECTIONS.find((s) => s.value === section)?.title ?? 'Pick a section'
              return {title, subtitle: enabled === false ? 'Hidden' : undefined}
            },
          },
        }),
      ],
      validation: (rule) =>
        rule.custom((items?: Array<{section?: string}>) => {
          const names = (items ?? []).map((i) => i.section).filter(Boolean)
          const dup = names.find((n, i) => names.indexOf(n) !== i)
          return dup ? `"${HOME_SECTIONS.find((s) => s.value === dup)?.title ?? dup}" is in the list twice` : true
        }),
    }),
    defineField({
      name: 'contactHeading',
      title: 'Contact Page Heading',
      type: 'localeString',
      group: 'contact',
    }),
    defineField({
      name: 'contactIntro',
      title: 'Contact Page Intro',
      type: 'localeText',
      group: 'contact',
    }),
    defineField({
      name: 'hireHeading',
      title: 'Hire Section Heading',
      type: 'localeString',
      group: 'contact',
      description: 'e.g. "Start a Project"',
    }),
    defineField({
      name: 'hireDescription',
      title: 'Hire Section Description',
      type: 'localeText',
      group: 'contact',
    }),
    defineField({
      name: 'hireBullets',
      title: 'Hire Section Bullet Points',
      type: 'localeStringList',
      group: 'contact',
      description: 'What to include in project inquiry',
    }),
    defineField({
      name: 'hireButtonText',
      title: 'Hire Button Text',
      type: 'localeString',
      group: 'contact',
    }),
    defineField({
      name: 'responseTime',
      title: 'Response Time Text',
      type: 'localeString',
      group: 'contact',
      description: 'e.g. "Typically responds within 24 hours"',
    }),
    defineField({
      name: 'helloHeading',
      title: 'Hello Section Heading',
      type: 'localeString',
      group: 'contact',
    }),
    defineField({
      name: 'helloDescription',
      title: 'Hello Section Description',
      type: 'localeText',
      group: 'contact',
    }),
    defineField({
      name: 'helloButtonText',
      title: 'Hello Button Text',
      type: 'localeString',
      group: 'contact',
    }),
    defineField({
      name: 'servicesHeading',
      title: 'Services Page Heading',
      type: 'localeString',
      group: 'services',
    }),
    defineField({
      name: 'servicesIntro',
      title: 'Services Page Intro',
      type: 'localeText',
      group: 'services',
    }),
    defineField({
      name: 'servicesCta',
      title: 'Services Bottom CTA Heading',
      type: 'localeString',
      group: 'services',
    }),
    defineField({
      name: 'servicesCtaDescription',
      title: 'Services Bottom CTA Description',
      type: 'localeText',
      group: 'services',
    }),
    defineField({
      name: 'serviceCaseStudiesHeading',
      title: 'Service Case Studies Heading',
      type: 'localeString',
      group: 'services',
      description: 'Heading above the case studies on a service detail page',
    }),
    defineField({
      name: 'projectServicesHeading',
      title: 'Project Related Services Heading',
      type: 'localeString',
      group: 'services',
      description: 'Heading above the related services on a project detail page',
    }),
    defineField({
      name: 'serviceDetailCtaHeading',
      title: 'Service Detail CTA Heading',
      type: 'localeString',
      group: 'services',
      description: 'CTA heading on service detail pages',
    }),
    defineField({
      name: 'serviceDetailCtaDescription',
      title: 'Service Detail CTA Description',
      type: 'localeString',
      group: 'services',
      description: 'CTA description on service detail pages',
    }),
    defineField({
      name: 'serviceDetailCtaButtonText',
      title: 'Service Detail CTA Button Text',
      type: 'localeString',
      group: 'services',
      description: 'CTA button text on service detail pages',
    }),
    defineField({
      name: 'navItems',
      title: 'Navigation Items',
      type: 'array',
      of: [{
        type: 'object',
        name: 'navItem',
        fields: [
          defineField({name: 'label', title: 'Label', type: 'localeString', validation: localeRequired}),
          defineField({name: 'href', title: 'Link', type: 'string', validation: (rule) => rule.required()}),
        ],
        preview: {select: {title: `label.${DEFAULT_LOCALE}`, subtitle: 'href'}},
      }],
      group: 'navigation',
    }),
    defineField({
      name: 'footerTagline',
      title: 'Footer Tagline',
      type: 'localeString',
      group: 'footer',
      description: 'Short description in the footer',
    }),
    defineField({
      name: 'aboutHeading',
      title: 'About Heading',
      type: 'localeString',
      group: 'sections',
      description: 'About section title',
    }),
    defineField({
      name: 'experienceHeading',
      title: 'Experience Heading',
      type: 'localeString',
      group: 'sections',
      description: 'Experience section title',
    }),
    defineField({
      name: 'projectsHeading',
      title: 'Projects Heading',
      type: 'localeString',
      group: 'sections',
      description: 'Projects section title',
    }),
    defineField({
      name: 'projectsIntro',
      title: 'Projects Intro',
      type: 'localeText',
      group: 'sections',
      description: 'Short intro text below the Projects heading on the homepage',
    }),
    defineField({
      name: 'skillsHeading',
      title: 'Skills Heading',
      type: 'localeString',
      group: 'sections',
      description: 'Skills/Technologies section title',
    }),
    defineField({
      name: 'homelabHeading',
      title: 'Homelab Heading',
      type: 'localeString',
      group: 'sections',
      description: 'Homelab section title',
    }),
    defineField({
      name: 'homelabSubtitle',
      title: 'Homelab Subtitle',
      type: 'localeString',
      group: 'sections',
      description: 'Homelab section subtitle',
    }),
    defineField({
      name: 'certificationsHeading',
      title: 'Certifications Heading',
      type: 'localeString',
      group: 'sections',
      description: 'Certifications section title',
    }),
    defineField({
      name: 'blogPreviewHeading',
      title: 'Blog Preview Heading',
      type: 'localeString',
      group: 'sections',
      description: 'Blog preview section title on home page',
    }),
    defineField({
      name: 'contactSectionHeading',
      title: 'Contact Section Heading',
      type: 'localeString',
      group: 'sections',
      description: 'Contact section heading on home page',
    }),
    defineField({
      name: 'contactSectionTagline',
      title: 'Contact Section Tagline',
      type: 'localeString',
      group: 'sections',
      description: 'Contact section tagline on home page',
    }),
    defineField({
      name: 'floatingCtaText',
      title: 'Floating CTA Text',
      type: 'localeString',
      group: 'sections',
      description: 'Floating CTA button text, e.g. Available for hire',
    }),
    defineField({
      name: 'blogPageHeading',
      title: 'Blog Page Heading',
      type: 'localeString',
      group: 'blog',
      description: 'Blog index page heading',
    }),
    defineField({
      name: 'blogPageSubtitle',
      title: 'Blog Page Subtitle',
      type: 'localeString',
      group: 'blog',
      description: 'Blog index page subtitle',
    }),
    defineField({
      name: 'projectsPageHeading',
      title: 'Projects Page Heading',
      type: 'localeString',
      group: 'sections',
    }),
    defineField({
      name: 'projectsPageSubtitle',
      title: 'Projects Page Subtitle',
      type: 'localeString',
      group: 'sections',
    }),
    defineField({
      name: 'homelabPageHeading',
      title: 'Homelab Page Heading',
      type: 'localeString',
      group: 'sections',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Page Content'}
    },
  },
})
