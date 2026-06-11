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

async function callRoute(body: unknown) {
  const { POST } = await import('@/app/api/contact/route')
  const request = new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return POST(request)
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.resetModules()
    mocks.append.mockClear()
    mocks.append.mockResolvedValue({ uid: 123 })
    mocks.messageFlagsAdd.mockClear()
    mocks.getMailboxLock.mockClear()
    mocks.build.mockClear()
    mocks.build.mockResolvedValue(Buffer.from('raw message'))
    mocks.connect.mockClear()
    mocks.logout.mockClear()
    mocks.getContact.mockReset()
    mocks.getContact.mockResolvedValue(null)
    mockFetch.mockResolvedValue({ ok: true })
    delete process.env.DISCORD_CONTACT_WEBHOOK
    delete process.env.IMAP_USER
    delete process.env.IMAP_PASS
  })

  it('returns 200 with valid fields', async () => {
    process.env.IMAP_USER = 'imap-user@gmail.com'
    process.env.IMAP_PASS = 'imap-pass'
    mocks.getContact.mockResolvedValue({ formNotificationEmail: 'owner@example.com' })

    const res = await callRoute({
      formName: 'Contact',
      fields: { name: 'Alice', email: 'alice@example.com', message: 'Hi <script>alert("x")</script>' },
    })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(mocks.append).toHaveBeenCalled()
  })

  it('returns 400 when fields is missing', async () => {
    const res = await callRoute({ formName: 'Contact' })
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBeTruthy()
  })
})
