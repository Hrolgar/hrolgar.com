import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock nodemailer before importing the route
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail: vi.fn().mockResolvedValue({}) })),
  },
}))

// Mock Sanity queries
vi.mock('@/sanity/lib/queries', () => ({
  getContact: vi.fn().mockResolvedValue(null),
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
    mockFetch.mockResolvedValue({ ok: true })
    delete process.env.DISCORD_CONTACT_WEBHOOK
    delete process.env.SMTP_USER
    delete process.env.SMTP_PASS
  })

  it('returns 200 with valid fields', async () => {
    const res = await callRoute({ formName: 'Contact', fields: { name: 'Alice', email: 'alice@example.com', message: 'Hi' } })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('returns 400 when fields is missing', async () => {
    const res = await callRoute({ formName: 'Contact' })
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBeTruthy()
  })
})
