import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'contactInfo',
  title: 'Contact Info',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'github',
      title: 'GitHub',
      type: 'url',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn',
      type: 'url',
    }),
    defineField({
      name: 'twitter',
      title: 'Twitter / X',
      type: 'url',
    }),
    defineField({
      name: 'mastodon',
      title: 'Mastodon',
      type: 'url',
    }),
    defineField({
      name: 'upworkUrl',
      title: 'Upwork Profile',
      type: 'url',
    }),
    defineField({
      name: 'freelancerUrl',
      title: 'Freelancer.com Profile',
      type: 'url',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'availableForWork',
      title: 'Available for Work',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'contactFormEnabled',
      title: 'Enable Contact Form',
      type: 'boolean',
      initialValue: false,
      description: 'Show a contact form instead of just links',
    }),
  ],
  preview: {
    select: {title: 'email'},
    prepare({title}) {
      return {title: title || 'Contact Info'}
    },
  },
})
