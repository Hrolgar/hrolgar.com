import {defineType, defineField} from 'sanity'
import {DEFAULT_LOCALE} from '../locale'
import {localeRequired, localeSlugSource} from './localeFields'

export default defineType({
  name: 'category',
  title: 'Category',
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
  ],
  preview: {
    select: {title: `title.${DEFAULT_LOCALE}`},
  },
})
