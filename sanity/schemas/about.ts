import {defineType, defineField} from 'sanity'
import {DEFAULT_LOCALE} from '../locale'
import {localeRequired} from './localeFields'

export default defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero Section', default: true},
    {name: 'about', title: 'About Section'},
    {name: 'resume', title: 'Resume'},
  ],
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'localeString',
      group: 'hero',
      validation: localeRequired,
      description: 'Main heading shown in the hero section',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'localeText',
      group: 'hero',
      validation: localeRequired,
      description: 'Short description below the heading',
    }),
    defineField({
      name: 'roles',
      title: 'Animated Roles',
      type: 'localeStringList',
      group: 'hero',
      description: 'Roles that cycle with a typing animation (e.g. ".NET Developer", "Homelab Enthusiast")',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {hotspot: true},
      group: 'hero',
      description: 'Displayed as a circle in the hero section. Square images work best.',
    }),
    defineField({
      name: 'heroCta1Text',
      title: 'Primary CTA Text',
      type: 'localeString',
      group: 'hero',
      description: 'e.g. "See my work"',
    }),
    defineField({
      name: 'heroCta1Link',
      title: 'Primary CTA Link',
      type: 'string',
      group: 'hero',
      description: 'e.g. "/#projects"',
    }),
    defineField({
      name: 'heroCta2Text',
      title: 'Secondary CTA Text',
      type: 'localeString',
      group: 'hero',
      description: 'e.g. "Get in touch"',
    }),
    defineField({
      name: 'heroCta2Link',
      title: 'Secondary CTA Link',
      type: 'string',
      group: 'hero',
      description: 'e.g. "/contact"',
    }),
    defineField({
      name: 'body',
      title: 'About Text',
      type: 'localeBlock',
      group: 'about',
      description: 'Rich text content for the About Me section',
    }),
    defineField({
      name: 'resumeFile',
      title: 'Resume / CV',
      type: 'file',
      group: 'resume',
      description: 'PDF file — a download button will appear in the hero section',
    }),
  ],
  preview: {
    select: {
      title: `heading.${DEFAULT_LOCALE}`,
      media: 'profileImage',
    },
  },
})
