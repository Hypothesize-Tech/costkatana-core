/**
 * Example showing how to use the webhook integration with Cost Katana
 */
import { AICostTracker, WebhookManager } from 'ai-cost-tracker';

async function main() {
  // Initialize the cost tracker
  const tracker = new AICostTracker({
    apiKey: process.env.API_KEY!,
    projectId: process.env.PROJECT_ID!,
    provider: 'openai',
    enableSync: true,
  });

  // Initialize the webhook manager
  const webhookManager = new WebhookManager({
    apiKey: process.env.API_KEY!,
    projectId: process.env.PROJECT_ID!,
    defaultSecret: 'your_webhook_secret',
    retryConfig: {
      maxRetries: 3,
      backoffMultiplier: 2,
      initialDelay: 5000,
    },
  });

  // Register a new webhook endpoint
  const webhook = await webhookManager.registerWebhook({
    name: 'Cost Alert Webhook',
    description: 'Receive notifications for cost alerts',
    url: 'https://your-api.example.com/webhooks/cost-katana',
    events: [
      'cost.alert',
      'cost.threshold_exceeded',
      'budget.warning',
      'budget.exceeded',
    ],
    active: true,
    // Optional: override default secret
    secret: 'your_custom_webhook_secret',
    // Optional: custom headers
    headers: {
      'X-Custom-Header': 'custom-value',
    },
  });

  console.log('Webhook registered:', webhook);

  // List all registered webhooks
  const webhooks = await webhookManager.getWebhooks();
  console.log(`You have ${webhooks.length} registered webhooks`);

  // Send a test event to the webhook
  const testResult = await webhookManager.testWebhook(
    webhook.id,
    'cost.alert',
    {
      title: 'Test Cost Alert',
      description: 'This is a test cost alert',
      severity: 'medium',
      cost: {
        amount: 150,
        currency: 'USD',
        period: 'daily',
      },
    }
  );

  console.log('Test webhook result:', testResult);

  // Get webhook delivery history
  const deliveries = await webhookManager.getWebhookDeliveries(webhook.id, {
    limit: 10,
    status: 'success',
  });

  console.log(`Recent successful deliveries: ${deliveries.length}`);
}

main().catch(console.error);
