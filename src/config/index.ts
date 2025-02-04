import dotenv from 'dotenv';
dotenv.config();

export const SERVER_CONFIG = {
  name: 'lumbretravel',
  version: '0.1.6',
  capabilities: {
    resources: {},
    tools: {},
    prompts: {},
    sampling: {}
  }
};

export const API_CONFIG = {
  baseUrl: process.env.BASE_URL as string || 'https://app-api.lumbretravel.com.ar',
  auth: {
    username: process.env.USERNAME as string,
    password: process.env.PASSWORD as string,
    clientId: process.env.CLIENT_ID as string,
    clientSecret: process.env.CLIENT_SECRET as string
  }
};
