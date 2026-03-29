import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'theme', title: 'Theme Colors'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      group: 'general',
      validation: (rule) => rule.required(),
      initialValue: 'Ullrhome',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      group: 'general',
      description: 'Used in meta tags and as default page description',
    }),
    defineField({
      name: 'ogImage',
      title: 'Default Social Image',
      type: 'image',
      group: 'seo',
      description: 'Used when sharing on social media (1200x630 recommended)',
    }),
    defineField({
      name: 'primaryColor',
      title: 'Primary Color',
      type: 'color',
      group: 'theme',
      description: 'Main brand color. Default: #6366f1',
    }),
    defineField({
      name: 'secondaryColor',
      title: 'Secondary Color',
      type: 'color',
      group: 'theme',
      description: 'Used for gradients. Default: #8b5cf6',
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Color',
      type: 'color',
      group: 'theme',
      description: 'Highlights and tags. Default: #06b6d4',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
      group: 'theme',
      description: 'Page background. Default: #0a0a0f',
    }),
    defineField({
      name: 'surfaceColor',
      title: 'Surface Color',
      type: 'color',
      group: 'theme',
      description: 'Cards and elevated surfaces. Default: #141420',
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'color',
      group: 'theme',
      description: 'Primary text. Default: #f0f0f5',
    }),
    defineField({
      name: 'textSecondaryColor',
      title: 'Text Secondary Color',
      type: 'color',
      group: 'theme',
      description: 'Muted/secondary text. Default: #8888a0',
    }),
  ],
  preview: {
    select: {title: 'siteName'},
    prepare({title}) {
      return {title: title || 'Site Settings'}
    },
  },
})
