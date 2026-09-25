// The home page's sections, shared by the Studio schema (the picker) and the page (the
// renderer). The order and the on/off switches live in Page Content > Home Page; this
// list only says which sections exist. An empty list in the CMS falls back to
// DEFAULT_HOME_SECTIONS, so the page never renders blank.

export const HOME_SECTIONS = [
  {value: 'hero', title: 'Hero'},
  {value: 'about', title: 'About'},
  {value: 'projects', title: 'Projects'},
  {value: 'experience', title: 'Experience'},
  {value: 'skills', title: 'Skills'},
  {value: 'homelab', title: 'Homelab'},
  {value: 'certifications', title: 'Certifications'},
  {value: 'blog', title: 'Blog preview'},
  {value: 'contact', title: 'Contact'},
] as const

export type HomeSectionKey = (typeof HOME_SECTIONS)[number]['value']

export const DEFAULT_HOME_SECTIONS: HomeSectionKey[] = HOME_SECTIONS.map((s) => s.value)

export interface HomeSectionItem {
  _key: string
  section: HomeSectionKey
  enabled?: boolean
}

/** The sections to render, in order: the CMS list with hidden ones dropped, or the default. */
export function resolveHomeSections(items?: HomeSectionItem[] | null): HomeSectionKey[] {
  if (!items || items.length === 0) return DEFAULT_HOME_SECTIONS
  const known = new Set<string>(DEFAULT_HOME_SECTIONS)
  const seen = new Set<string>()
  return items
    .filter((i) => i.enabled !== false && known.has(i.section) && !seen.has(i.section) && seen.add(i.section))
    .map((i) => i.section)
}
