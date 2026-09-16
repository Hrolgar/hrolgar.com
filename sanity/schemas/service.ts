import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {list: [{title: 'English', value: 'en'}, {title: 'Norsk', value: 'nb'}], layout: 'radio'},
      initialValue: 'en',
      description: 'Which language this document is written in. Leave as English unless this IS the Norwegian version.',
    }),
    defineField({
      name: 'translationOf',
      title: 'Translation of',
      type: 'reference',
      to: [{type: 'service'}],
      description: 'On a Norwegian document, point this at the English original. Leave empty on English documents.',
      hidden: ({document}) => document?.language !== 'nb',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'Short description shown on the services overview',
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Detailed service description for the services page',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon identifier (e.g. "api", "backend", "automation")',
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
    select: {title: 'title', subtitle: 'summary'},
  },
})
