import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'homelabService',
  title: 'Homelab Service',
  type: 'document',
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
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Virtualization', value: 'virtualization'},
          {title: 'Networking', value: 'networking'},
          {title: 'Storage', value: 'storage'},
          {title: 'Media', value: 'media'},
          {title: 'Security', value: 'security'},
          {title: 'Monitoring', value: 'monitoring'},
          {title: 'Development', value: 'development'},
          {title: 'Identity', value: 'identity'},
          {title: 'Automation', value: 'automation'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
    }),
    defineField({
      name: 'selfHosted',
      title: 'Self-Hosted',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'Public-facing URL (if any)',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'icon',
    },
  },
})
