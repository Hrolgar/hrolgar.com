import { describe, it, expect } from 'vitest'
import { schemaTypes } from '@/sanity/schemas/index'

const expectedSchemas = [
  'siteSettings',
  'about',
  'skill',
  'experience',
  'project',
  'projectCategory',
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
  const schemaNames = schemaTypes.map((s) => s.name)

  it('contains all expected schema names', () => {
    expect(schemaNames).toEqual(expect.arrayContaining(expectedSchemas))
  })

  it('has no duplicate schema names', () => {
    expect(schemaNames).toHaveLength(new Set(schemaNames).size)
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
