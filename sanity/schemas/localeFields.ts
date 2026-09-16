import {defineField, defineType} from 'sanity'
import type {Rule} from 'sanity'
import {DEFAULT_LOCALE, LOCALES, localeLabel} from '../locale'

/**
 * Translatable field types, GENERATED from the locale list.
 *
 * A translatable field holds one value per language in a single document, instead of the
 * document itself being duplicated per language. That matters because most of a document
 * is not language-specific at all: the slug, the image, the dates, the sort order. Under
 * the old document-per-language scheme those were copied into the twin and then drifted
 * apart, which is how the Norwegian About page lost its portrait and its CV.
 *
 * Nothing here names a language. Adding one is a single entry in `LOCALES` (sanity/locale.ts):
 * every translatable field in every schema grows a box for it on the next deploy, existing
 * documents keep working because a missing value falls back to English, and no migration
 * is needed. That is the whole reason these are built with `.map()` rather than written out.
 */

/** The languages a translatable field carries, in order, English first. */
const localeFieldsFor = (inner: Record<string, unknown>) =>
  LOCALES.map((locale) =>
    defineField({
      name: locale,
      title: localeLabel[locale],
      ...inner,
    } as never),
  )

const defineLocaleType = (name: string, title: string, inner: Record<string, unknown>) =>
  defineType({
    name,
    title,
    type: 'object',
    // English first and always visible; the rest sit under it. Collapsing by default would
    // hide the language that is written 100% of the time to save a click on the one that is not.
    fields: localeFieldsFor(inner),
  })

/**
 * The one rich-text definition, shared by every body on the site.
 *
 * Each schema used to declare its own member list, and they had already drifted: a blog post
 * could take an inline image with a caption, a project's inline image had no caption, and the
 * homelab page's had an alt text that nobody could translate. One definition, one renderer.
 *
 * Everything inside here is single-valued, because the body it sits in is already per-language.
 */
export const richText = defineType({
  name: 'richText',
  title: 'Rich text',
  type: 'array',
  of: [
    {type: 'block'},
    {
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt Text', type: 'string'}),
        defineField({name: 'caption', title: 'Caption', type: 'string'}),
      ],
    },
    {type: 'code', title: 'Code Block'},
  ],
})

export const localeString = defineLocaleType('localeString', 'Text', {type: 'string'})

export const localeText = defineLocaleType('localeText', 'Text (multi-line)', {
  type: 'text',
  rows: 3,
})

export const localeBlock = defineLocaleType('localeBlock', 'Rich text', {type: 'richText'})

export const localeStringList = defineLocaleType('localeStringList', 'List of text', {
  type: 'array',
  of: [{type: 'string'}],
  options: {layout: 'tags'},
})

export const localeTypes = [richText, localeString, localeText, localeBlock, localeStringList]

/**
 * Validation for a translatable field that must be filled in.
 *
 * Only the default language is required. Requiring every language would make adding a
 * language a site-wide outage until someone had translated everything, which is exactly
 * the friction this design exists to remove.
 */
export const localeRequired = (rule: Rule) =>
  rule.required().custom((value: Record<string, unknown> | undefined) => {
    const primary = value?.[DEFAULT_LOCALE]
    const filled = Array.isArray(primary) ? primary.length > 0 : Boolean(primary)
    return filled || `${localeLabel[DEFAULT_LOCALE]} is required`
  })

/** Slug sources read the default language, since a slug is generated from the English title. */
export const localeSlugSource = (doc: Record<string, unknown>, field: string = 'title') => {
  const value = doc?.[field] as Record<string, string> | undefined
  return value?.[DEFAULT_LOCALE] || ''
}
