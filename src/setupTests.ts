import '@testing-library/jest-dom'
import { vi } from 'vitest'

const noop = vi.fn()
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true })
