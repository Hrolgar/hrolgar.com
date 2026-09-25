import {defineField, defineType} from 'sanity'
import {localeRequired} from './localeFields'

/**
 * The privacy notice. A singleton, edited in Studio like every other page.
 *
 * It describes what the code does with visitor data, so when the contact route gains a
 * destination or analytics changes, this document needs updating in the same breath. Bump
 * `lastUpdated` when the substance changes: it is the date shown on the page and the
 * sitemap lastmod.
 */
export default defineType({
  name: 'privacyPage',
  title: 'Privacy Page',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'localeString', validation: localeRequired}),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'localeText',
      description: 'The short version, shown above the sections.',
    }),
    defineField({name: 'body', title: 'Body', type: 'localeBlock'}),
    defineField({
      name: 'lastUpdated',
      title: 'Last updated',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'formNote',
      title: 'Note under contact forms',
      type: 'localeString',
      description: 'One line under every contact form, followed by a link to this page.',
    }),
  ],
  preview: {prepare: () => ({title: 'Privacy Page'})},
})
