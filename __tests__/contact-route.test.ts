import { describe, it, expect, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => ({
  sendMail: vi.fn().mockResolvedValue({}),
  getContact: vi.fn().mockResolvedValue(null),
}))

// Mock nodemailer before importing the route
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail: mocks.sendMail })),
  },
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
    mocks.sendMail.mockClear()
    mocks.getContact.mockReset()
    mocks.getContact.mockResolvedValue(null)
    mockFetch.mockResolvedValue({ ok: true })
    delete process.env.DISCORD_CONTACT_WEBHOOK
    delete process.env.SMTP_USER
    delete process.env.SMTP_PASS
  })

  it('returns 200 with valid fields', async () => {
    process.env.SMTP_USER = 'smtp-user'
    process.env.SMTP_PASS = 'smtp-pass'
    mocks.getContact.mockResolvedValue({ formNotificationEmail: 'owner@example.com' })

    const res = await callRoute({ formName: 'Contact', fields: { name: 'Alice', email: 'alice@example.com', message: 'Hi <script>alert("x")</script>' } })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(mocks.sendMail.mock.calls[0][0].html).toContain('Hi &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;')
  })

  it('returns 400 when fields is missing', async () => {
    const res = await callRoute({ formName: 'Contact' })
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBeTruthy()
  })
})
