import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js'
import moment from 'moment'

export function formatDate (dateStr: unknown): string {
  // Type validation
  if (typeof dateStr !== 'string') {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Date must be a string in YYYY-MM-DD format'
    )
  }

  // Try to parse the date with different formats
  const formats = [
    'YYYY-MM-DD',
    'MM/DD/YYYY',
    'DD MMMM YYYY',
    'YYYY-MM-DDTHH:mm:ss.SSSZ',
    'DD-MM-YYYY'
  ]

  const parsedDate = moment(dateStr, formats, true)

  // Check if the date is valid
  if (!parsedDate.isValid()) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `Invalid date format: ${dateStr}`
    )
  }

  // Additional validation for impossible dates
  const month = parsedDate.month() + 1 // moment uses 0-11 for months
  const day = parsedDate.date()

  if (month > 12 || month < 1 || day > 31 || day < 1) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `Invalid date format: ${dateStr}`
    )
  }

  // Return in the desired format
  return parsedDate.format('DD-MM-YYYY')
}

export function convertToISOWithOffset (date: string): string {
  // Type validation
  if (typeof date !== 'string') {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Date must be a string in DD-MM-YYYY format'
    )
  }

  try {
    // Parse the date in DD-MM-YYYY format
    const parsedDate = moment(date, 'DD-MM-YYYY', true)

    // Check if the date is valid
    if (!parsedDate.isValid()) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid date format: ${date}`
      )
    }

    // Set the time to 03:00:00.000 and convert to ISO
    return parsedDate
      .hour(3)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toISOString()
  } catch (error) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `Error converting date: '${date}'`
    )
  }
}
