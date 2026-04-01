import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homelabPage',
  title: 'Homelab Page',
  type: 'document',
  fields: [
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'array',
      of: [{type: 'block'}],
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
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
            }),
            defineField({
              name: 'specs',
              title: 'Specs',
              type: 'text',
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
            }),
          ],
          preview: {select: {title: 'name', subtitle: 'description'}},
        },
      ],
    }),
    defineField({
      name: 'architecture',
      title: 'Architecture',
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
          ],
        },
      ],
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
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
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
