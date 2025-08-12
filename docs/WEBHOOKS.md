# Webhook Integration Guide

## Overview

The Cost Katana webhook system allows you to receive real-time notifications about important events in your AI cost optimization workflow. Webhooks enable you to build integrations that respond to events as they happen, rather than requiring you to poll for updates.

## Supported Events

The webhook system supports a wide range of event types across different categories:

### Cost & Budget Events
- `cost.alert`: General cost alerts
- `cost.threshold_exceeded`: Cost threshold has been exceeded
- `cost.spike_detected`: Unusual spike in costs detected
- `cost.anomaly_detected`: Anomalous cost pattern detected
- `budget.warning`: Budget is approaching its limit
- `budget.exceeded`: Budget has been exceeded

### Optimization Events
- `optimization.completed`: An optimization process has completed
- `optimization.failed`: An optimization process has failed
- `optimization.suggested`: New optimization suggestions available
- `optimization.applied`: Optimizations have been applied
- `savings.milestone_reached`: A savings milestone has been reached

### Model & Performance Events
- `model.performance_degraded`: Model performance has degraded
- `model.error_rate_high`: Model error rate is higher than normal
- `model.latency_high`: Model response time is higher than normal
- `model.quota_warning`: Approaching model usage quota limits
- `model.quota_exceeded`: Model usage quota has been exceeded

### Usage Events
- `usage.spike_detected`: Unusual spike in usage detected
- `usage.pattern_changed`: Usage pattern has changed significantly
- `token.limit_warning`: Approaching token usage limits
- `token.limit_exceeded`: Token usage limits exceeded
- `api.rate_limit_warning`: Approaching API rate limits

### Experiment & Training Events
- `experiment.started`: An experiment has started
- `experiment.completed`: An experiment has completed
- `experiment.failed`: An experiment has failed
- `training.started`: A training process has started
- `training.completed`: A training process has completed
- `training.failed`: A training process has failed

### Workflow Events
- `workflow.started`: A workflow has started
- `workflow.completed`: A workflow has completed
- `workflow.failed`: A workflow has failed
- `workflow.step_completed`: A workflow step has completed

### Security & Compliance Events
- `security.alert`: Security-related alert
- `compliance.violation`: Compliance violation detected
- `data.privacy_alert`: Data privacy alert
- `moderation.blocked`: Content moderation has blocked content

### System Events
- `system.error`: System error occurred
- `service.degradation`: Service degradation detected
- `maintenance.scheduled`: Maintenance has been scheduled

### Agent Events
- `agent.task_completed`: Agent task completed
- `agent.task_failed`: Agent task failed
- `agent.insight_generated`: Agent has generated an insight

### Quality Events
- `quality.degraded`: Quality metrics have degraded
- `quality.improved`: Quality metrics have improved
- `quality.threshold_violated`: Quality threshold has been violated

## Webhook Payload

Each webhook delivery includes a JSON payload with information about the event. Here's an example payload:

```json
{
  "event_id": "evt_123456789",
  "event_type": "cost.alert",
  "occurred_at": "2025-08-12T05:00:29.500Z",
  "severity": "high",
  "title": "Monthly cost threshold exceeded",
  "description": "Your monthly AI cost has exceeded the configured threshold of $500.",
  "resource": {
    "type": "project",
    "id": "proj_abcdef123",
    "name": "Production API"
  },
  "metrics": {
    "current": 550,
    "threshold": 500,
    "change": 50,
    "changePercentage": 10,
    "unit": "USD"
  },
  "cost": {
    "amount": 550,
    "currency": "USD",
    "period": "monthly",
    "breakdown": {
      "gpt-4": 300,
      "claude-3-opus": 200,
      "embedding": 50
    }
  },
  "user": {
    "id": "user_123456",
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "project": {
    "id": "proj_abcdef123",
    "name": "Production API"
  },
  "costkatana": {
    "version": "2.0.0",
    "environment": "production"
  }
}
```

## Security

### Authentication

Webhooks support multiple authentication methods:

1. **None**: No authentication (not recommended for production)
2. **Basic Auth**: Username and password authentication
3. **Bearer Token**: JWT or other token-based authentication
4. **Custom Header**: Custom header for authentication
5. **OAuth2**: OAuth 2.0 authentication (client credentials flow)

### Signature Verification

All webhook payloads are signed using HMAC-SHA256. The signature is included in the `X-CostKatana-Signature` header with the format `sha256=<signature>`. To verify the signature:

1. Retrieve your webhook secret from the dashboard
2. Extract the timestamp from the `X-CostKatana-Timestamp` header
3. Concatenate the timestamp and the raw request body with a period: `${timestamp}.${rawBody}`
4. Compute an HMAC-SHA256 signature using your webhook secret
5. Compare your signature to the one in the `X-CostKatana-Signature` header

Example verification code (Node.js):

```javascript
const crypto = require('crypto');

function verifySignature(payload, timestamp, signature, secret) {
  const signaturePayload = `${timestamp}.${payload}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signaturePayload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(`sha256=${expectedSignature}`),
    Buffer.from(signature)
  );
}
```

## Best Practices

1. **Respond quickly**: Your webhook endpoint should respond with a 2xx status code as quickly as possible, ideally within 5 seconds.

2. **Process asynchronously**: Handle the webhook payload processing asynchronously after sending the response.

3. **Implement retries**: Implement retry logic in your webhook consumer to handle temporary failures.

4. **Verify signatures**: Always verify webhook signatures to ensure the webhook is coming from Cost Katana.

5. **Handle idempotency**: Use the `event_id` to ensure you don't process the same event multiple times.

6. **Monitor deliveries**: Use the webhook dashboard to monitor successful and failed deliveries.

## Integration Examples

### Node.js Express Example

```javascript
const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

// Use raw body parser to get the raw request body for signature verification
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

app.post('/webhook', (req, res) => {
  // Get the signature and timestamp from headers
  const signature = req.headers['x-costkatana-signature'];
  const timestamp = req.headers['x-costkatana-timestamp'];
  
  // Verify the signature
  const isValid = verifySignature(
    req.rawBody.toString(),
    timestamp,
    signature,
    WEBHOOK_SECRET
  );
  
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process the webhook
  const event = req.body;
  console.log(`Received ${event.event_type} event:`, event);
  
  // Handle different event types
  switch (event.event_type) {
    case 'cost.alert':
      // Handle cost alert
      break;
    case 'optimization.completed':
      // Handle optimization completed
      break;
    // ... handle other event types
  }
  
  // Respond quickly
  res.status(200).send('Webhook received');
  
  // Process asynchronously
  processWebhookAsync(event).catch(console.error);
});

function verifySignature(payload, timestamp, signature, secret) {
  const signaturePayload = `${timestamp}.${payload}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signaturePayload)
    .digest('hex');
  
  return `sha256=${expectedSignature}` === signature;
}

async function processWebhookAsync(event) {
  // Process the webhook asynchronously
  // This could involve updating a database, sending notifications, etc.
}

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});
```

### Python Flask Example

```python
import hmac
import hashlib
import time
from flask import Flask, request, jsonify

app = Flask(__name__)
WEBHOOK_SECRET = "your_webhook_secret"

@app.route('/webhook', methods=['POST'])
def webhook():
    # Get the signature and timestamp from headers
    signature = request.headers.get('X-CostKatana-Signature')
    timestamp = request.headers.get('X-CostKatana-Timestamp')
    
    # Get the raw request body
    payload = request.data.decode('utf-8')
    
    # Verify the signature
    if not verify_signature(payload, timestamp, signature, WEBHOOK_SECRET):
        return jsonify({"error": "Invalid signature"}), 401
    
    # Parse the JSON payload
    event = request.json
    print(f"Received {event['event_type']} event:", event)
    
    # Handle different event types
    if event['event_type'] == 'cost.alert':
        # Handle cost alert
        pass
    elif event['event_type'] == 'optimization.completed':
        # Handle optimization completed
        pass
    # ... handle other event types
    
    # Respond quickly
    return jsonify({"status": "success"}), 200

def verify_signature(payload, timestamp, signature, secret):
    signature_payload = f"{timestamp}.{payload}"
    expected_signature = hmac.new(
        secret.encode(),
        signature_payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return f"sha256={expected_signature}" == signature

if __name__ == '__main__':
    app.run(port=3000)
```

## Troubleshooting

### Common Issues

1. **Webhook delivery failing**: Check your endpoint's response status code. Only 2xx responses are considered successful.

2. **Invalid signature errors**: Ensure you're using the correct webhook secret and that you're calculating the signature correctly.

3. **Timeout errors**: Your endpoint is taking too long to respond. Aim to respond within 5 seconds.

4. **Missing events**: Check that you've subscribed to the correct event types.

### Testing Webhooks

You can use the webhook testing tool in the dashboard to send test events to your endpoint. This is useful for verifying that your endpoint is correctly configured.

Alternatively, you can use a tool like [webhook.site](https://webhook.site/) to create a temporary endpoint for testing.

## API Reference

For programmatic webhook management, refer to the [API documentation](API.md#webhooks).
