import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'faq',
  title: 'FAQ',
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
      to: [{type: 'faq'}],
      description: 'On a Norwegian document, point this at the English original. Leave empty on English documents.',
      hidden: ({document}) => document?.language !== 'nb',
    }),
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
  ],
  preview: {
    select: {title: 'question'},
  },
})
