import dotenv from 'dotenv'
dotenv.config()

export const SERVER_CONFIG = {
  name: 'lumbretravel',
  version: '0.1.11',
  capabilities: {
    resources: {},
    tools: {},
    prompts: {},
    sampling: {}
  }
}

export const API_CONFIG = {
  baseUrl: process.env.BASE_URL! || 'https://app-api.lumbretravel.com.ar',
  auth: {
    username: process.env.EMAIL!,
    password: process.env.PASSWORD!,
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!
  }
}
