import fetch from 'node-fetch'
import { API_CONFIG } from '../config/index.js'
import { type AuthResponse } from '../types/index.js'
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js'

export class AuthService {
  async getAccessToken (): Promise<string> {
    try {
      const auth = Buffer.from(
        `${API_CONFIG.auth.clientId}:${API_CONFIG.auth.clientSecret}`
      ).toString('base64')

      const formData = new URLSearchParams({
        grant_type: 'password',
        username: API_CONFIG.auth.username,
        password: API_CONFIG.auth.password,
        scope: 'public'
      })

      const response = await fetch(`${API_CONFIG.baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${auth}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new McpError(
          ErrorCode.InternalError,
          `LumbreTravel Auth error: ${response.statusText}`
        )
      }

      const data = await response.json() as AuthResponse
      return data.access_token
    } catch (error) {
      if (error instanceof McpError) {
        throw error
      }
      throw new McpError(
        ErrorCode.InternalError,
        `LumbreTravel Auth error: ${(error as Error).message}`
      )
    }
  }
}
