import { describe, it, expect } from 'vitest'
import { buildIndexNowUrls } from '@/app/api/revalidate/route'

describe('buildIndexNowUrls', () => {
  it('always includes the homepage', () => {
    const urls = buildIndexNowUrls(undefined)
    expect(urls).toContain('https://hrolgar.com')
  })

  it('adds blog list + item URL for a post', () => {
    const urls = buildIndexNowUrls({ _type: 'post', slug: { current: 'my-post' } })
    expect(urls).toContain('https://hrolgar.com/blog')
    expect(urls).toContain('https://hrolgar.com/blog/my-post')
  })

  it('adds projects list + item URL for a project', () => {
    const urls = buildIndexNowUrls({ _type: 'project', slug: { current: 'cool-project' } })
    expect(urls).toContain('https://hrolgar.com/projects')
    expect(urls).toContain('https://hrolgar.com/projects/cool-project')
  })

  it('adds services list + item URL for a service', () => {
    const urls = buildIndexNowUrls({ _type: 'service', slug: 'my-service' })
    expect(urls).toContain('https://hrolgar.com/services')
    expect(urls).toContain('https://hrolgar.com/services/my-service')
  })

  it('handles a nested document field', () => {
    const urls = buildIndexNowUrls({ document: { _type: 'post', slug: { current: 'nested' } } })
    expect(urls).toContain('https://hrolgar.com/blog')
    expect(urls).toContain('https://hrolgar.com/blog/nested')
  })

  it('returns only homepage when body is empty JSON object', () => {
    const urls = buildIndexNowUrls({})
    expect(urls).toEqual(['https://hrolgar.com'])
  })

  it('deduplicates list and item when they are the same path', () => {
    const urls = buildIndexNowUrls({ _type: 'category', slug: { current: 'javascript' } })
    const blogUrls = urls.filter(u => u === 'https://hrolgar.com/blog')
    expect(blogUrls).toHaveLength(1)
    expect(urls).toContain('https://hrolgar.com/blog/category/javascript')
  })
})
