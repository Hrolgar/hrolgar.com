import {defineType, defineField} from 'sanity'

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
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.required(),
      description: 'Main heading shown in the hero section',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.required(),
      description: 'Short description below the heading',
    }),
    defineField({
      name: 'roles',
      title: 'Animated Roles',
      type: 'array',
      of: [{type: 'string'}],
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
      name: 'body',
      title: 'About Text',
      type: 'array',
      of: [{type: 'block'}],
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
      title: 'heading',
      media: 'profileImage',
    },
  },
})
