import { describe, it, expect } from 'vitest'
import { schemaTypes } from '@/sanity/schemas/index'
import { localeTypes } from '@/sanity/schemas/localeFields'
import { LOCALES } from '@/sanity/locale'

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

  it('every content schema is a document', () => {
    const supporting = new Set(localeTypes.map((t) => t.name))
    for (const schema of schemaTypes) {
      if (supporting.has(schema.name)) continue
      expect(schema.type).toBe('document')
    }
  })

  // The point of generating the translatable types is that a new language is one entry in
  // LOCALES and nothing else. If these ever have to be edited by hand to add a language,
  // the design has quietly reverted to the thing it replaced.
  it('translatable field types carry exactly the configured languages', () => {
    for (const type of localeTypes) {
      if (type.name === 'richText') continue
      const fields = (type as { fields: { name: string }[] }).fields
      expect(fields.map((f) => f.name)).toEqual([...LOCALES])
    }
  })

  it('rich text is defined once and shared', () => {
    const richText = localeTypes.find((t) => t.name === 'richText') as
      | { of: { type: string }[] }
      | undefined
    expect(richText).toBeDefined()
    // block + inline image + code: the union of what the three bodies used to declare
    // separately, before they drifted apart.
    expect(richText!.of.map((m) => m.type).sort()).toEqual(['block', 'code', 'image'])
  })
})
