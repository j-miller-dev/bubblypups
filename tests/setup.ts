import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock InertiaJS globals
global.route = vi.fn()

// Mock fetch for API calls
global.fetch = vi.fn()

// Set up DOM properly
beforeEach(() => {
  // Mock document methods
  Object.defineProperty(document, 'querySelector', {
    value: vi.fn((selector) => {
      if (selector === 'meta[name="csrf-token"]') {
        return { content: 'test-token' }
      }
      return null
    }),
    writable: true
  })

  // Mock addEventListener
  Object.defineProperty(document, 'addEventListener', {
    value: vi.fn(),
    writable: true
  })

  Object.defineProperty(document, 'removeEventListener', {
    value: vi.fn(),
    writable: true
  })
})