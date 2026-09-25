import {defineType, defineField} from 'sanity'
import {DEFAULT_LOCALE} from '../locale'
import {localeRequired, localeSlugSource} from './localeFields'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: localeRequired,
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: (doc) => localeSlugSource(doc), maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'localeText',
      description: 'Short description shown on the services overview',
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'localeBlock',
      description: 'Detailed service description for the services page',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon identifier (e.g. "api", "backend", "automation")',
    }),
    defineField({
      name: 'caseStudies',
      title: 'Case studies',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
      description:
        'Projects that show this service in practice. Listed on the service page, and each project links back to the services that list it.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
  ],
  preview: {
    select: {title: `title.${DEFAULT_LOCALE}`, subtitle: `summary.${DEFAULT_LOCALE}`},
  },
})
