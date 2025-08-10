/**
 * Example: Using Cost Katana Distributed Tracing
 * 
 * This example demonstrates how to instrument your application
 * with distributed tracing to track AI operations.
 */

import express from 'express';
import {
  LocalTraceService,
  createTraceMiddleware,
  TrackedOpenAI,
  TrackedAnthropic,
  TraceClient
} from '../src/trace';

// 1. Create a trace service (local or cloud)
const useCloudTracing = process.env.USE_CLOUD_TRACING === 'true';

const traceService = useCloudTracing
  ? new TraceClient({
      apiKey: process.env.API_KEY!,
      projectId: process.env.PROJECT_ID!
    })
  : new LocalTraceService({
      storageMode: 'file',
      storageDir: './traces',
      autoSave: true,
      autoSaveInterval: 60000 // Save every minute
    });

// 2. Create Express app with tracing middleware
const app = express();
app.use(express.json());

// Add tracing middleware - this automatically creates root spans for all requests
app.use(createTraceMiddleware({
  startSpan: traceService.startSpan.bind(traceService),
  endSpan: traceService.endSpan.bind(traceService),
  includeDetails: true // Include request/response details in traces
}));

// 3. Example endpoint using traced OpenAI
app.post('/api/chat/openai', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Create a traced OpenAI client with the request context
    const ai = new TrackedOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      traceContext: req.traceContext, // Automatically attached by middleware
      startSpan: traceService.startSpan.bind(traceService),
      endSpan: traceService.endSpan.bind(traceService),
      recordMessage: traceService.recordMessage?.bind(traceService)
    });
    
    // Make the API call - automatically traced!
    const response = await ai.chatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message }
      ],
      maxTokens: 150,
      temperature: 0.7
    });
    
    res.json({
      success: true,
      response: response.choices[0].message?.content,
      sessionId: res.locals.sessionId,
      traceId: res.locals.traceId
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      sessionId: res.locals.sessionId,
      traceId: res.locals.traceId
    });
  }
});

// 4. Example endpoint using traced Anthropic
app.post('/api/chat/anthropic', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Create a traced Anthropic client
    const ai = new TrackedAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      traceContext: req.traceContext,
      startSpan: traceService.startSpan.bind(traceService),
      endSpan: traceService.endSpan.bind(traceService),
      recordMessage: traceService.recordMessage?.bind(traceService)
    });
    
    // Make the API call - automatically traced!
    const response = await ai.messages({
      model: 'claude-3-haiku-20240307',
      messages: [
        { role: 'user', content: message }
      ],
      system: 'You are a helpful assistant.',
      maxTokens: 150,
      temperature: 0.7
    });
    
    res.json({
      success: true,
      response: response.choices[0].message?.content,
      sessionId: res.locals.sessionId,
      traceId: res.locals.traceId
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      sessionId: res.locals.sessionId,
      traceId: res.locals.traceId
    });
  }
});

// 5. Example: Complex workflow with multiple spans
app.post('/api/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    const sessionId = res.locals.sessionId;
    const parentTraceId = res.locals.traceId;
    
    // Step 1: Text preprocessing (custom span)
    const preprocessSpan = await traceService.startSpan({
      sessionId,
      parentId: parentTraceId,
      name: 'text-preprocessing',
      type: 'tool',
      metadata: { textLength: text.length }
    });
    
    const preprocessedText = text.toLowerCase().trim();
    
    await traceService.endSpan(preprocessSpan.traceId, {
      status: 'ok',
      metadata: { processedLength: preprocessedText.length }
    });
    
    // Step 2: Sentiment analysis with OpenAI
    const sentimentSpan = await traceService.startSpan({
      sessionId,
      parentId: parentTraceId,
      name: 'sentiment-analysis',
      type: 'llm',
      metadata: { provider: 'openai' }
    });
    
    const ai = new TrackedOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      traceContext: {
        sessionId,
        traceId: sentimentSpan.traceId,
        parentId: parentTraceId
      },
      startSpan: traceService.startSpan.bind(traceService),
      endSpan: traceService.endSpan.bind(traceService)
    });
    
    const sentimentResponse = await ai.chatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'Analyze the sentiment of the text. Response with: positive, negative, or neutral.' 
        },
        { role: 'user', content: preprocessedText }
      ],
      maxTokens: 10,
      temperature: 0
    });
    
    const sentiment = sentimentResponse.choices[0].message?.content || 'unknown';
    
    await traceService.endSpan(sentimentSpan.traceId, {
      status: 'ok',
      metadata: { sentiment }
    });
    
    res.json({
      success: true,
      sentiment,
      sessionId,
      traceId: res.locals.traceId
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      sessionId: res.locals.sessionId,
      traceId: res.locals.traceId
    });
  }
});

// 6. Endpoint to view session traces
app.get('/api/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Get session graph
    const graph = await traceService.getSessionGraph(sessionId);
    
    // Get session details
    const details = await traceService.getSessionDetails(sessionId);
    
    res.json({
      success: true,
      session: details,
      graph
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 7. Endpoint to list all sessions
app.get('/api/sessions', async (req, res) => {
  try {
    if ('listSessions' in traceService) {
      const sessions = await (traceService as LocalTraceService).listSessions({
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20
      });
      
      res.json({
        success: true,
        ...sessions
      });
    } else {
      res.json({
        success: false,
        error: 'List sessions not supported in cloud mode'
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 8. Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Tracing mode: ${useCloudTracing ? 'Cloud' : 'Local'}`);
  console.log(`\nTry these endpoints:`);
  console.log(`  POST http://localhost:${PORT}/api/chat/openai`);
  console.log(`  POST http://localhost:${PORT}/api/chat/anthropic`);
  console.log(`  POST http://localhost:${PORT}/api/analyze`);
  console.log(`  GET  http://localhost:${PORT}/api/sessions`);
  console.log(`  GET  http://localhost:${PORT}/api/sessions/:sessionId`);
});

// 9. Cleanup on exit
process.on('SIGINT', () => {
  if (traceService instanceof LocalTraceService) {
    traceService.destroy();
  }
  process.exit();
});
