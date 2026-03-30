import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contactForm',
  title: 'Contact Form',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Form Name',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'e.g. "Project Inquiry" or "General Contact"',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'formField',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'name',
              title: 'Field Name',
              type: 'string',
              validation: (rule) => rule.required(),
              description: 'e.g. "name", "email", "message"',
            }),
            defineField({
              name: 'type',
              title: 'Field Type',
              type: 'string',
              options: {list: ['text', 'email', 'textarea', 'select']},
              initialValue: 'text',
            }),
            defineField({
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
            }),
            defineField({
              name: 'required',
              title: 'Required',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'options',
              title: 'Options (for select)',
              type: 'array',
              of: [{type: 'string'}],
              hidden: ({parent}) => parent?.type !== 'select',
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'type'},
          },
        },
      ],
    }),
    defineField({
      name: 'submitText',
      title: 'Submit Button Text',
      type: 'string',
      initialValue: 'Send Message',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success Message',
      type: 'string',
      initialValue: "Thanks! I'll get back to you soon.",
    }),
  ],
  preview: {
    select: {title: 'name'},
  },
})
