#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  ListToolsRequestSchema,
  CallToolRequestSchema
} from '@modelcontextprotocol/sdk/types.js'

import { SERVER_CONFIG } from './config/index.js'
import { ToolsHandler } from './handlers/tools.handler.js'

class LumbreTravelServer {
  private readonly server: Server
  private readonly toolsHandler: ToolsHandler

  constructor () {
    // Initialize the MCP server
    this.server = new Server(
      {
        name: SERVER_CONFIG.name,
        version: SERVER_CONFIG.version
      },
      {
        capabilities: SERVER_CONFIG.capabilities
      }
    )

    // Initialize the handlers
    this.toolsHandler = new ToolsHandler()

    // Configure the handlers and error handling
    this.setupHandlers()
    this.setupErrorHandling()
  }

  private setupHandlers (): void {
    // Configure handlers to list tools
    this.server.setRequestHandler(
      ListToolsRequestSchema,
      async () => this.toolsHandler.listTools()
    )

    // Configure handlers for tools
    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request) => await this.toolsHandler.callTool(request.params.name, request.params.arguments, this.server)
    )
  }

  private setupErrorHandling (): void {
    // Handle general server errors
    this.server.onerror = (error) => {
      console.error('[LumbreTravel MCP Error]', error)
    }

    // Handle interrupt signal (Ctrl+C)
    process.on('SIGINT', async () => {
      await this.server.close()
      process.exit(0)
    })

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('[Uncaught Exception]', error)
      process.exit(1)
    })

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('[Unhandled Rejection]', reason)
      process.exit(1)
    })
  }

  async run (): Promise<void> {
    try {
      // Create and initialize the stdio transport
      const transport = new StdioServerTransport()
      await this.server.connect(transport)

      // Start message (using stderr to avoid interfering with MCP communication)
      console.error(`${SERVER_CONFIG.name} MCP server running (v${SERVER_CONFIG.version})`)
    } catch (error) {
      console.error('Failed to start server:', error)
      process.exit(1)
    }
  }
}

// Start the server
const server = new LumbreTravelServer()
server.run().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
