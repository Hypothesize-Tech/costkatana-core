# Webhook Integration Guide

## Overview

Cost Katana webhooks notify you about important events in real-time. Perfect for monitoring costs, tracking usage, and automating responses.

## Quick Start

### Using Simple API

```typescript
import { ai, configure } from 'cost-katana';

// Configure webhook endpoint
await configure({
  apiKey: 'dak_your_key',
  webhookUrl: 'https://your-api.com/webhooks/costkatana'
});

// Use normally - webhooks fire automatically
await ai('gpt-4', 'Expensive request');
// Webhook fires if cost threshold exceeded
```

## Supported Events

### Cost Events
- `cost.alert` - Cost alert triggered
- `cost.threshold_exceeded` - Threshold exceeded
- `cost.spike_detected` - Unusual cost spike
- `budget.warning` - Approaching budget limit
- `budget.exceeded` - Budget limit exceeded

### Optimization Events
- `optimization.completed` - Optimization finished
- `optimization.suggested` - New suggestions available
- `savings.milestone_reached` - Savings milestone hit

### Usage Events
- `usage.spike_detected` - Usage spike detected
- `usage.pattern_changed` - Pattern change detected

## Webhook Payload

```json
{
  "event_id": "evt_123",
  "event_type": "cost.alert",
  "occurred_at": "2025-01-15T10:30:00Z",
  "severity": "high",
  "title": "Cost threshold exceeded",
  "description": "Monthly cost exceeded $500",
  "metrics": {
    "current": 550,
    "threshold": 500,
    "unit": "USD"
  },
  "cost": {
    "amount": 550,
    "currency": "USD",
    "period": "monthly"
  }
}
```

## Setting Up Webhooks

### Express.js Endpoint

```typescript
import express from 'express';
import { verifyWebhookSignature } from 'cost-katana';

const app = express();
app.use(express.json());

app.post('/webhooks/costkatana', (req, res) => {
  const signature = req.headers['x-costkatana-signature'];
  const timestamp = req.headers['x-costkatana-timestamp'];
  const payload = JSON.stringify(req.body);
  
  // Verify signature
  const isValid = verifyWebhookSignature(
    payload,
    timestamp,
    signature,
    process.env.WEBHOOK_SECRET
  );
  
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }
  
  const event = req.body;
  
  // Handle events
  switch (event.event_type) {
    case 'cost.alert':
      console.log('Cost alert:', event.description);
      // Send Slack notification
      break;
      
    case 'budget.exceeded':
      console.log('Budget exceeded:', event.metrics);
      // Send email alert
      break;
      
    case 'optimization.suggested':
      console.log('Optimization available:', event.description);
      // Log suggestion
      break;
  }
  
  res.status(200).send('OK');
});

app.listen(3000);
```

### Next.js API Route

```typescript
// app/api/webhooks/costkatana/route.ts
import { verifyWebhookSignature } from 'cost-katana';

export async function POST(request: Request) {
  const signature = request.headers.get('x-costkatana-signature');
  const timestamp = request.headers.get('x-costkatana-timestamp');
  const body = await request.text();
  
  const isValid = verifyWebhookSignature(
    body,
    timestamp,
    signature,
    process.env.WEBHOOK_SECRET!
  );
  
  if (!isValid) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  const event = JSON.parse(body);
  
  // Handle event
  console.log('Webhook received:', event.event_type);
  
  return Response.json({ received: true });
}
```

## Event Handling Examples

### Cost Alerts

```typescript
app.post('/webhooks/costkatana', (req, res) => {
  const event = req.body;
  
  if (event.event_type === 'cost.alert') {
    // Send Slack notification
    sendSlackMessage({
      channel: '#cost-alerts',
      text: `🚨 ${event.title}: $${event.cost.amount}`,
      details: event.description
    });
  }
  
  res.status(200).send('OK');
});
```

### Budget Warnings

```typescript
app.post('/webhooks/costkatana', (req, res) => {
  const event = req.body;
  
  if (event.event_type === 'budget.warning') {
    const percentage = (event.metrics.current / event.metrics.threshold) * 100;
    
    console.log(`⚠️ Budget at ${percentage}%`);
    
    // Take action
    if (percentage > 90) {
      // Disable non-critical AI features
      disableOptionalAIFeatures();
    }
  }
  
  res.status(200).send('OK');
});
```

### Optimization Suggestions

```typescript
app.post('/webhooks/costkatana', (req, res) => {
  const event = req.body;
  
  if (event.event_type === 'optimization.suggested') {
    // Log optimization opportunity
    console.log('💡 Optimization available:');
    console.log(event.description);
    console.log(`Potential savings: $${event.metrics.estimated_savings}`);
    
    // Auto-apply if savings > $10/month
    if (event.metrics.estimated_savings > 10) {
      applyOptimization(event.optimization_id);
    }
  }
  
  res.status(200).send('OK');
});
```

## Security

### Signature Verification

All webhooks include a cryptographic signature:

```typescript
import crypto from 'crypto';

function verifyWebhookSignature(
  payload: string,
  timestamp: string,
  signature: string,
  secret: string
): boolean {
  const signaturePayload = `${timestamp}.${payload}`;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(signaturePayload)
    .digest('hex');
  
  return `sha256=${expected}` === signature;
}
```

### Best Practices

1. **Always verify signatures**
   ```typescript
   if (!verifyWebhookSignature(...)) {
     return res.status(401).send('Invalid');
   }
   ```

2. **Respond quickly (< 5 seconds)**
   ```typescript
   res.status(200).send('OK');
   processWebhookAsync(event); // Process in background
   ```

3. **Handle duplicates with event_id**
   ```typescript
   const processed = new Set();
   
   if (processed.has(event.event_id)) {
     return res.status(200).send('Already processed');
   }
   
   processed.add(event.event_id);
   ```

4. **Implement retry logic**
   ```typescript
   async function processWebhook(event: any) {
     const maxRetries = 3;
     
     for (let i = 0; i < maxRetries; i++) {
       try {
         await handleEvent(event);
         return;
       } catch (error) {
         if (i === maxRetries - 1) throw error;
         await sleep(1000 * Math.pow(2, i));
       }
     }
   }
   ```

## Integration Examples

### Slack Notifications

```typescript
import { ai } from 'cost-katana';

async function sendToSlack(message: string) {
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify({ text: message })
  });
}

// In your webhook handler
if (event.event_type === 'cost.alert') {
  await sendToSlack(
    `🚨 Cost Alert: ${event.description}\nAmount: $${event.cost.amount}`
  );
}
```

### Email Notifications

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({...});

// In webhook handler
if (event.event_type === 'budget.exceeded') {
  await transporter.sendMail({
    to: 'admin@company.com',
    subject: '⚠️ AI Budget Exceeded',
    text: `Your AI budget has been exceeded.\nCurrent: $${event.cost.amount}\nLimit: $${event.metrics.threshold}`
  });
}
```

### Database Logging

```typescript
import { db } from './database';

// Log all webhook events
app.post('/webhooks/costkatana', async (req, res) => {
  const event = req.body;
  
  await db.webhookEvents.insert({
    eventId: event.event_id,
    eventType: event.event_type,
    severity: event.severity,
    timestamp: event.occurred_at,
    data: event
  });
  
  res.status(200).send('OK');
});
```

## Testing Webhooks

### Local Testing with ngrok

```bash
# Install ngrok
npm install -g ngrok

# Start your local server
node server.js

# Expose it
ngrok http 3000

# Use the ngrok URL in Cost Katana dashboard
# https://abc123.ngrok.io/webhooks/costkatana
```

### Test Payload

```typescript
// Send test webhook
const testPayload = {
  event_id: 'test_123',
  event_type: 'cost.alert',
  occurred_at: new Date().toISOString(),
  severity: 'medium',
  title: 'Test Alert',
  description: 'This is a test',
  cost: { amount: 100, currency: 'USD' }
};

await fetch('http://localhost:3000/webhooks/costkatana', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testPayload)
});
```

## Troubleshooting

### Webhook Not Receiving Events

1. **Check endpoint is accessible**
   ```bash
   curl -X POST https://your-api.com/webhooks/costkatana \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```

2. **Verify webhook is active in dashboard**
   - Visit https://costkatana.com/settings/webhooks
   - Check webhook status is "Active"

3. **Check event subscriptions**
   - Ensure you're subscribed to the events you want

### Signature Verification Failing

1. **Use raw body for verification**
   ```typescript
   app.use(express.json({
     verify: (req, res, buf) => {
       req.rawBody = buf.toString();
     }
   }));
   ```

2. **Check secret matches**
   - Verify webhook secret in dashboard
   - Ensure secret is correct in your code

### Missing Events

Check your event subscriptions and filters:
```typescript
// Make sure you're subscribed to the events
// Visit: https://costkatana.com/settings/webhooks
```

## Support

- **Documentation**: https://docs.costkatana.com/webhooks
- **Dashboard**: https://costkatana.com/settings/webhooks
- **GitHub**: https://github.com/Hypothesize-Tech/costkatana-core
- **Email**: support@costkatana.com