/**
 * Framework Integration Examples
 * 
 * Shows how to integrate Cost Katana with popular frameworks:
 * - Next.js (App Router & Pages Router)
 * - Express
 * - Fastify
 * - NestJS
 * - Hono
 */

import { ai, chat, configure } from '../src';

// =============================================================================
// NEXT.JS EXAMPLES
// =============================================================================

/**
 * Next.js App Router API Route
 * File: app/api/chat/route.ts
 */
export async function nextJsAppRouterExample() {
  // This would be your Next.js API route handler
  const POST = async (request: Request) => {
    const { prompt } = await request.json();
    
    const response = await ai('gpt-4', prompt, {
      cache: true,  // Cache for faster responses
      cortex: true  // Optimize costs
    });
    
    return Response.json({
      text: response.text,
      cost: response.cost,
      tokens: response.tokens
    });
  };
  
  return POST;
}

/**
 * Next.js Pages Router API Route
 * File: pages/api/chat.ts
 */
export async function nextJsPagesRouterExample() {
  const handler = async (req: any, res: any) => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { prompt } = req.body;
    
    try {
      const response = await ai('gpt-4', prompt);
      
      res.status(200).json({
        text: response.text,
        cost: response.cost,
        tokens: response.tokens
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };
  
  return handler;
}

/**
 * Next.js Server Component
 * File: app/chat/page.tsx
 */
export async function nextJsServerComponentExample() {
  async function ChatPage() {
    // Server-side AI call
    const greeting = await ai('gpt-3.5-turbo', 'Say hello to the user');
    
    return `
      <div>
        <h1>Chat</h1>
        <p>${greeting.text}</p>
        <p>Cost: $${greeting.cost}</p>
      </div>
    `;
  }
  
  return ChatPage;
}

// =============================================================================
// EXPRESS.JS EXAMPLES
// =============================================================================

/**
 * Express.js Basic Setup
 */
export function expressBasicExample() {
  const express = require('express');
  const app = express();
  
  app.use(express.json());
  
  // Simple endpoint
  app.post('/api/chat', async (req: any, res: any) => {
    const { prompt } = req.body;
    
    try {
      const response = await ai('gpt-4', prompt);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });
  
  // Chat session endpoint
  const sessions = new Map();
  
  app.post('/api/chat/session', async (req: any, res: any) => {
    const { sessionId, message } = req.body;
    
    // Get or create session
    let session = sessions.get(sessionId);
    if (!session) {
      session = chat('gpt-4', {
        systemMessage: 'You are a helpful assistant.'
      });
      sessions.set(sessionId, session);
    }
    
    const response = await session.send(message);
    
    res.json({
      response,
      cost: session.totalCost,
      tokens: session.totalTokens
    });
  });
  
  return app;
}

// =============================================================================
// FASTIFY EXAMPLES
// =============================================================================

/**
 * Fastify Setup
 */
export async function fastifyExample() {
  const fastify = require('fastify');
  const app = fastify();
  
  // Simple endpoint
  app.post('/api/chat', async (request: any, reply: any) => {
    const { prompt } = request.body;
    const response = await ai('gpt-4', prompt);
    return response;
  });
  
  // Streaming response (for long content)
  app.post('/api/chat/stream', async (request: any, reply: any) => {
    const { prompt } = request.body;
    
    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('Connection', 'keep-alive');
    
    const response = await ai('gpt-4', prompt, { cortex: true });
    
    // Simulate streaming (in real app, you'd stream tokens)
    reply.raw.write(`data: ${JSON.stringify(response)}\n\n`);
    reply.raw.end();
  });
  
  return app;
}

// =============================================================================
// NESTJS EXAMPLES
// =============================================================================

/**
 * NestJS Controller
 */
export function nestJsControllerExample() {
  // @Controller('chat')
  class ChatController {
    // @Post()
    async chat(body: { prompt: string }) {
      const response = await ai('gpt-4', body.prompt);
      return response;
    }
    
    // @Post('session')
    async chatSession(body: { sessionId: string; message: string }) {
      // Use a session management service here
      const session = chat('gpt-4');
      const response = await session.send(body.message);
      return { response, cost: session.totalCost };
    }
  }
  
  return ChatController;
}

/**
 * NestJS Service
 */
export function nestJsServiceExample() {
  // @Injectable()
  class AiService {
    async generateText(prompt: string, options = {}) {
      return await ai('gpt-4', prompt, options);
    }
    
    async chat(messages: string[]) {
      const session = chat('gpt-3.5-turbo');
      const responses = [];
      
      for (const message of messages) {
        responses.push(await session.send(message));
      }
      
      return {
        responses,
        totalCost: session.totalCost,
        totalTokens: session.totalTokens
      };
    }
  }
  
  return AiService;
}

// =============================================================================
// HONO EXAMPLES (Edge Runtime)
// =============================================================================

/**
 * Hono (Cloudflare Workers, Deno, Bun)
 */
export function honoExample() {
  const { Hono } = require('hono');
  const app = new Hono();
  
  app.post('/api/chat', async (c: any) => {
    const { prompt } = await c.req.json();
    const response = await ai('gpt-4', prompt, { cache: true });
    return c.json(response);
  });
  
  return app;
}

// =============================================================================
// MIDDLEWARE EXAMPLES
// =============================================================================

/**
 * Express Middleware for Cost Tracking
 */
export function costTrackingMiddleware() {
  return async (req: any, res: any, next: any) => {
    const originalJson = res.json.bind(res);
    
    res.json = function (data: any) {
      // Add cost information to all responses
      if (data && typeof data === 'object' && data.cost) {
        console.log(`Request cost: $${data.cost}`);
        
        // Track in your analytics
        // analytics.track('ai_request', { cost: data.cost });
      }
      
      return originalJson(data);
    };
    
    next();
  };
}

/**
 * Rate Limiting Middleware
 */
export function rateLimitingMiddleware() {
  const userCosts = new Map();
  const DAILY_LIMIT = 10; // $10 per day
  
  return async (req: any, res: any, next: any) => {
    const userId = req.user?.id || req.ip;
    const today = new Date().toISOString().split('T')[0];
    const key = `${userId}:${today}`;
    
    const userDailyCost = userCosts.get(key) || 0;
    
    if (userDailyCost >= DAILY_LIMIT) {
      return res.status(429).json({
        error: 'Daily cost limit exceeded',
        limit: DAILY_LIMIT,
        used: userDailyCost
      });
    }
    
    // Track cost after request
    const originalJson = res.json.bind(res);
    res.json = function (data: any) {
      if (data && data.cost) {
        userCosts.set(key, userDailyCost + data.cost);
      }
      return originalJson(data);
    };
    
    next();
  };
}

// =============================================================================
// REAL-WORLD EXAMPLE: CHAT API WITH ALL FEATURES
// =============================================================================

export function fullFeaturedChatAPI() {
  const express = require('express');
  const app = express();
  
  app.use(express.json());
  
  // Configure Cost Katana
  configure({
    cortex: true,  // Enable optimization
    cache: true,   // Enable caching
    firewall: true // Enable security
  });
  
  // Session storage
  const sessions = new Map();
  
  // Chat endpoint
  app.post('/api/chat', async (req: any, res: any) => {
    const { sessionId, message, model = 'gpt-4' } = req.body;
    
    try {
      // Get or create session
      let session = sessions.get(sessionId);
      if (!session) {
        session = chat(model, {
          systemMessage: 'You are a helpful AI assistant.'
        });
        sessions.set(sessionId, session);
      }
      
      // Send message
      const response = await session.send(message);
      
      // Return response with stats
      res.json({
        message: response,
        session: {
          messageCount: session.messages.length,
          totalCost: session.totalCost,
          totalTokens: session.totalTokens
        }
      });
      
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  });
  
  // Get session stats
  app.get('/api/chat/:sessionId/stats', (req: any, res: any) => {
    const session = sessions.get(req.params.sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({
      messageCount: session.messages.length,
      totalCost: session.totalCost,
      totalTokens: session.totalTokens,
      messages: session.messages
    });
  });
  
  // Clear session
  app.delete('/api/chat/:sessionId', (req: any, res: any) => {
    sessions.delete(req.params.sessionId);
    res.json({ success: true });
  });
  
  return app;
}

// Run examples
if (require.main === module) {
  console.log('🎯 Framework Integration Examples\n');
  console.log('These are example patterns for integrating Cost Katana');
  console.log('with different frameworks. Copy the relevant code to your');
  console.log('project and customize as needed.\n');
  console.log('Available examples:');
  console.log('- Next.js (App Router & Pages Router)');
  console.log('- Express.js');
  console.log('- Fastify');
  console.log('- NestJS');
  console.log('- Hono (Edge Runtime)');
  console.log('\nFor more details, see the framework documentation at:');
  console.log('https://docs.costkatana.com/frameworks');
}
