import { describe, it, expect, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => ({
  append: vi.fn().mockResolvedValue({ uid: 123 }),
  messageFlagsAdd: vi.fn().mockResolvedValue(true),
  getMailboxLock: vi.fn().mockResolvedValue({ release: vi.fn() }),
  build: vi.fn().mockResolvedValue(Buffer.from('raw message')),
  connect: vi.fn().mockResolvedValue(undefined),
  logout: vi.fn().mockResolvedValue(undefined),
  getContact: vi.fn().mockResolvedValue(null),
}))

vi.mock('imapflow', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ImapFlow: vi.fn(function(this: any) {
    this.connect = mocks.connect
    this.logout = mocks.logout
    this.append = mocks.append
    this.getMailboxLock = mocks.getMailboxLock
    this.messageFlagsAdd = mocks.messageFlagsAdd
  }),
}))

vi.mock('nodemailer/lib/mail-composer', () => ({
  default: vi.fn(function() {
    return {
      compile: vi.fn(() => ({ build: mocks.build })),
    }
  }),
}))

vi.mock('@/sanity/lib/queries', () => ({
  getContact: mocks.getContact,
}))

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

async function makeRequest(ip: string) {
  const { POST } = await import('@/app/api/contact/route')
  const request = new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify({ formName: 'Contact', fields: { name: 'Test', message: 'Hello' } }),
  })
  return POST(request)
}

describe('contact rate limiting', () => {
  beforeEach(() => {
    vi.resetModules()
    mockFetch.mockResolvedValue({ ok: true })
    delete process.env.DISCORD_CONTACT_WEBHOOK
    delete process.env.IMAP_USER
    delete process.env.IMAP_PASS
  })

  it('allows up to 5 requests from the same IP within the window', async () => {
    for (let i = 0; i < 5; i++) {
      const res = await makeRequest('1.2.3.4')
      expect(res.status).not.toBe(429)
    }
  })

  it('blocks the 6th request from the same IP with 429', async () => {
    for (let i = 0; i < 5; i++) {
      await makeRequest('1.2.3.4')
    }
    const res = await makeRequest('1.2.3.4')
    expect(res.status).toBe(429)
    const json = await res.json()
    expect(json.error).toMatch(/too many requests/i)
  })

  it('does not rate-limit a different IP', async () => {
    for (let i = 0; i < 5; i++) {
      await makeRequest('1.2.3.4')
    }
    expect((await makeRequest('1.2.3.4')).status).toBe(429)
    const res = await makeRequest('5.6.7.8')
    expect(res.status).not.toBe(429)
  })
})
