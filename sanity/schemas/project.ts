import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
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
    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      options: {
        list: [
          {title: 'Personal', value: 'personal'},
          {title: 'Freelance', value: 'freelance'},
        ],
      },
      initialValue: 'personal',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'projectCategory'}]}],
      description: 'Categorize this project (e.g. Web App, Automation, DevOps)',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
    }),
    defineField({
      name: 'description',
      title: 'Description',
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
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'skill'}]}],
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'liveUrl',
      title: 'Live URL',
      type: 'url',
    }),
    defineField({
      name: 'problem',
      title: 'The Problem',
      type: 'text',
      rows: 4,
      description: 'What problem did this project solve?',
    }),
    defineField({
      name: 'approach',
      title: 'The Approach',
      type: 'text',
      rows: 4,
      description: 'How did you approach solving it?',
    }),
    defineField({
      name: 'outcome',
      title: 'The Outcome',
      type: 'text',
      rows: 4,
      description: 'What was the result?',
    }),
    defineField({
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
      description: 'Optional — client or company name',
    }),
    defineField({
      name: 'testimonial',
      title: 'Client Testimonial',
      type: 'text',
      rows: 3,
      description: 'Optional quote from the client',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      summary: 'summary',
      projectType: 'projectType',
      media: 'image',
    },
    prepare({title, summary, projectType}: {title: string; summary?: string; projectType?: string}) {
      const subtitle = [projectType, summary].filter(Boolean).join(' — ')
      return {title, subtitle}
    },
  },
})
