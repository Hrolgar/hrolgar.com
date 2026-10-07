import {defineType, defineField} from 'sanity'
import {DEFAULT_LOCALE} from '../locale'
import {localeRequired, localeSlugSource} from './localeFields'

/**
 * One page per system a buyer already runs (Fiken, Tripletex, BankID...).
 *
 * Kept apart from `service` on purpose: a service says what I do, an integration answers the
 * search a buyer actually types ("fiken integrasjon"). Ten of them in the services grid would
 * bury the services, so they get their own section under /integrations.
 */
export default defineType({
  name: 'integration',
  title: 'Integration',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      description: 'The H1, e.g. "Fiken-integrasjon". Name the system the way people search for it.',
      validation: localeRequired,
    }),
    defineField({
      name: 'system',
      title: 'System name',
      type: 'string',
      description: 'Short name for cards and breadcrumbs, e.g. "Fiken"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'English, like every other URL on the site',
      options: {source: (doc) => localeSlugSource(doc), maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'localeString',
      description: 'The <title>. Falls back to the title.',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'localeText',
      description: 'Lead paragraph, the meta description and the text on the overview card',
    }),
    defineField({
      name: 'description',
      title: 'Body',
      type: 'localeBlock',
    }),
    defineField({
      name: 'faqs',
      title: 'Questions',
      type: 'array',
      description: 'Shown under the body and sent to Google as FAQ data',
      of: [
        {
          type: 'object',
          name: 'integrationFaq',
          fields: [
            defineField({name: 'question', title: 'Question', type: 'localeString', validation: localeRequired}),
            defineField({name: 'answer', title: 'Answer', type: 'localeText', validation: localeRequired}),
          ],
          preview: {select: {title: `question.${DEFAULT_LOCALE}`}},
        },
      ],
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
  ],
  orderings: [{title: 'Order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'system', subtitle: `title.${DEFAULT_LOCALE}`},
  },
})
