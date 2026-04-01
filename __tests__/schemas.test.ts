import { describe, it, expect } from 'vitest'
import { schemaTypes } from '@/sanity/schemas/index'

const expectedSchemas = [
  'siteSettings',
  'about',
  'skill',
  'experience',
  'project',
  'contactInfo',
  'post',
  'category',
  'certification',
  'homelabService',
  'homelabPage',
  'service',
  'faq',
  'pageContent',
  'contactForm',
]

describe('Sanity schemas', () => {
  it('exports the expected number of schemas', () => {
    expect(schemaTypes).toHaveLength(expectedSchemas.length)
  })

  it.each(expectedSchemas)('schema "%s" has name and type properties', (name) => {
    const schema = schemaTypes.find((s) => s.name === name)
    expect(schema).toBeDefined()
    expect(schema!.name).toBe(name)
    expect(schema!.type).toBeTruthy()
  })

  it('all schemas have type "document"', () => {
    for (const schema of schemaTypes) {
      expect(schema.type).toBe('document')
    }
  })
})
