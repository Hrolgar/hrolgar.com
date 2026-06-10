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
      name: 'formNotificationEmail',
      title: 'Form Notification Email',
      type: 'string',
      description: 'Where contact-form submissions are emailed. Separate from the public display email.',
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
      description: 'e.g. Ålesund, Norway',
    }),
    defineField({
      name: 'availableForWork',
      title: 'Available for Work',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'email'},
    prepare({title}) {
      return {title: title || 'Contact Info'}
    },
  },
})
