import {defineField, defineType} from 'sanity'
import {DEFAULT_LOCALE} from '../locale'
import {localeRequired} from './localeFields'

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'localeString',
      validation: localeRequired,
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'localeText',
      validation: localeRequired,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
  ],
  preview: {
    select: {title: `question.${DEFAULT_LOCALE}`},
  },
})
