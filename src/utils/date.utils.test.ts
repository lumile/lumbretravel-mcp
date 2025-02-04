import { describe, it, expect } from 'vitest'
import { formatDate } from './date.utils.js'
import { McpError } from '@modelcontextprotocol/sdk/types.js'

describe('formatDate', () => {
  it('should format correctly dates in different formats', () => {
    const testCases = [
      { input: '2024-03-20', expected: '20-03-2024' },
      { input: '03/20/2024', expected: '20-03-2024' },
      { input: '20 March 2024', expected: '20-03-2024' },
      { input: '2024-03-20T15:30:00.000Z', expected: '20-03-2024' },
      { input: '20-03-2024', expected: '20-03-2024' }
    ]

    testCases.forEach(({ input, expected }) => {
      expect(formatDate(input)).toBe(expected)
    })
  })

  it('should throw error for invalid dates', () => {
    const invalidDates = [
      '2024-13-20',
      '2024-03-32',
      'no es una fecha',
      '20240320'
    ]

    invalidDates.forEach((invalidDate) => {
      expect(() => formatDate(invalidDate)).toThrow(McpError)
    })
  })

  it('should throw error for non-string data types', () => {
    const invalidTypes = [
      123,
      true,
      null,
      undefined,
      {},
      []
    ] as const

    invalidTypes.forEach((invalidType) => {
      expect(() => formatDate(invalidType as any)).toThrow(McpError)
    })
  })
})
