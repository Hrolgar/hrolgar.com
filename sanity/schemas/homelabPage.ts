import {defineField, defineType} from 'sanity'
import {DEFAULT_LOCALE} from '../locale'
import {localeRequired} from './localeFields'

export default defineType({
  name: 'homelabPage',
  title: 'Homelab Page',
  type: 'document',
  fields: [
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'localeBlock',
    }),
    defineField({
      name: 'hardware',
      title: 'Hardware',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'hardwareItem',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'localeString',
              validation: localeRequired,
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'localeText',
            }),
            defineField({
              name: 'specs',
              title: 'Specs',
              type: 'localeText',
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
            }),
          ],
          preview: {select: {title: `name.${DEFAULT_LOCALE}`, subtitle: `description.${DEFAULT_LOCALE}`}},
        },
      ],
    }),
    defineField({
      name: 'architecture',
      title: 'Architecture',
      type: 'localeBlock',
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'stat',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'localeString',
              validation: localeRequired,
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: `label.${DEFAULT_LOCALE}`, subtitle: 'value'}},
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Homelab Page'}
    },
  },
})
