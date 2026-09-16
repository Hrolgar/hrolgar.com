import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
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
      to: [{type: 'category'}],
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
  ],
  preview: {
    select: {title: 'title'},
  },
})
