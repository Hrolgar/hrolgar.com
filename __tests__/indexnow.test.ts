import { describe, it, expect } from 'vitest'
import { buildIndexNowUrls, resolveIndexNowUrls, webhookDocIds } from '@/app/api/revalidate/route'

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

  it('submits the blog list but never a (noindex) category page', () => {
    const urls = buildIndexNowUrls({ _type: 'category', slug: { current: 'javascript' } })
    expect(urls.filter(u => u === 'https://hrolgar.com/blog')).toHaveLength(1)
    expect(urls.some(u => u.includes('/blog/category/'))).toBe(false)
  })
})

describe('resolveIndexNowUrls', () => {
  it('looks the document up when the webhook sends only an id', async () => {
    const urls = await resolveIndexNowUrls({ _id: 'drafts.post-x' }, async (ids) => {
      expect(ids).toEqual(['post-x'])
      return [{ _type: 'post', slug: 'my-post', status: 'published' }]
    })
    expect(urls).toContain('https://hrolgar.com/blog/my-post')
  })

  it('understands the legacy ids payload', async () => {
    const urls = await resolveIndexNowUrls({ ids: { created: [], updated: ['project-a'], deleted: [] } }, async () => [
      { _type: 'project', slug: 'a' },
    ])
    expect(urls).toContain('https://hrolgar.com/projects/a')
  })

  it('leaves out a post that is still a draft', async () => {
    const urls = await resolveIndexNowUrls({ _id: 'post-y' }, async () => [{ _type: 'post', slug: 'y', status: 'draft' }])
    expect(urls).toEqual(['https://hrolgar.com'])
  })

  it('uses the body only when there is no id to look up', async () => {
    const urls = await resolveIndexNowUrls({ _type: 'post', slug: { current: 'z' } }, async () => {
      throw new Error('should not be called')
    })
    expect(urls).toContain('https://hrolgar.com/blog/z')
  })

  it('trusts the lookup over the body when an id is present, so a draft post is not submitted', async () => {
    const urls = await resolveIndexNowUrls({ _id: 'post-d', _type: 'post', slug: { current: 'd' } }, async () => [
      { _type: 'post', slug: 'd', status: 'draft' },
    ])
    expect(urls).toEqual(['https://hrolgar.com'])
  })

  it('still sends the homepage when the lookup fails', async () => {
    const urls = await resolveIndexNowUrls({ _id: 'post-q' }, async () => {
      throw new Error('network')
    })
    expect(urls).toEqual(['https://hrolgar.com'])
  })

  it('collects ids from both shapes without duplicates', () => {
    expect(webhookDocIds({ _id: 'a', ids: { updated: ['drafts.a', 'b'] } })).toEqual(['a', 'b'])
  })
})
