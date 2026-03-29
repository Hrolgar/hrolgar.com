import { describe, it, expect } from 'vitest'
import { settingsToCssVars } from '@/lib/theme'

describe('settingsToCssVars', () => {
  it('returns empty object for null settings', () => {
    expect(settingsToCssVars(null)).toEqual({})
  })

  it('maps plain hex string colors to CSS variables', () => {
    const settings = {
      primaryColor: '#6366f1',
      textColor: '#f0f0f5',
    } as any

    const result = settingsToCssVars(settings)
    expect(result).toEqual({
      '--color-primary': '#6366f1',
      '--color-text': '#f0f0f5',
    })
  })

  it('maps Sanity color objects (with hex property) to CSS variables', () => {
    const settings = {
      primaryColor: { hex: '#6366f1', _type: 'color' },
      accentColor: { hex: '#06b6d4', _type: 'color' },
    } as any

    const result = settingsToCssVars(settings)
    expect(result).toEqual({
      '--color-primary': '#6366f1',
      '--color-accent': '#06b6d4',
    })
  })

  it('skips keys with falsy values', () => {
    const settings = {
      primaryColor: '#6366f1',
      secondaryColor: null,
      accentColor: undefined,
    } as any

    const result = settingsToCssVars(settings)
    expect(result).toEqual({
      '--color-primary': '#6366f1',
    })
  })

  it('maps all seven color keys when provided', () => {
    const settings = {
      primaryColor: '#111111',
      secondaryColor: '#222222',
      accentColor: '#333333',
      backgroundColor: '#444444',
      surfaceColor: '#555555',
      textColor: '#666666',
      textSecondaryColor: '#777777',
    } as any

    const result = settingsToCssVars(settings)
    expect(Object.keys(result)).toHaveLength(7)
    expect(result).toEqual({
      '--color-primary': '#111111',
      '--color-secondary': '#222222',
      '--color-accent': '#333333',
      '--color-bg': '#444444',
      '--color-surface': '#555555',
      '--color-text': '#666666',
      '--color-text-secondary': '#777777',
    })
  })
})
