import { describe, it, expect, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => ({
  append: vi.fn().mockResolvedValue({ uid: 123 }),
  build: vi.fn().mockResolvedValue(Buffer.from('raw message')),
  connect: vi.fn().mockResolvedValue(undefined),
  getContact: vi.fn().mockResolvedValue(null),
  logout: vi.fn().mockResolvedValue(undefined),
  mailboxOpen: vi.fn().mockResolvedValue(undefined),
  mailOptions: undefined as Record<string, unknown> | undefined,
  messageFlagsAdd: vi.fn().mockResolvedValue(true),
}))

// Mock IMAP/MIME dependencies before importing the route
vi.mock('imapflow', () => ({
  ImapFlow: vi.fn(() => ({
    append: mocks.append,
    connect: mocks.connect,
    logout: mocks.logout,
    mailboxOpen: mocks.mailboxOpen,
    messageFlagsAdd: mocks.messageFlagsAdd,
  })),
}))

vi.mock('nodemailer/lib/mail-composer', () => ({
  default: vi.fn((options: Record<string, unknown>) => {
    mocks.mailOptions = options
    return {
      compile: vi.fn(() => ({ build: mocks.build })),
    }
  },
  ),
}))

// Mock Sanity queries
vi.mock('@/sanity/lib/queries', () => ({
  getContact: mocks.getContact,
}))

// Mock global fetch for Discord
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

async function callRoute(body: unknown) {
  // Dynamic import so mocks are in place first
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
    mocks.build.mockClear()
    mocks.build.mockResolvedValue(Buffer.from('raw message'))
    mocks.connect.mockClear()
    mocks.getContact.mockReset()
    mocks.getContact.mockResolvedValue(null)
    mocks.logout.mockClear()
    mocks.mailboxOpen.mockClear()
    mocks.mailOptions = undefined
    mocks.messageFlagsAdd.mockClear()
    mockFetch.mockResolvedValue({ ok: true })
    delete process.env.DISCORD_CONTACT_WEBHOOK
    delete process.env.IMAP_USER
    delete process.env.IMAP_PASS
  })

  it('returns 200 with valid fields', async () => {
    process.env.IMAP_USER = 'imap-user@example.com'
    process.env.IMAP_PASS = 'imap-pass'
    mocks.getContact.mockResolvedValue({ formNotificationEmail: 'owner@example.com' })

    const res = await callRoute({ formName: 'Contact', fields: { name: 'Alice', email: 'alice@example.com', message: 'Hi <script>alert("x")</script>' } })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(mocks.mailOptions?.html).toContain('Hi &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;')
    expect(mocks.mailOptions?.subject).toBe('New contact from Alice')
  })

  it('returns 400 when fields is missing', async () => {
    const res = await callRoute({ formName: 'Contact' })
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBeTruthy()
  })
})
