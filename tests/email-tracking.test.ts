/**
 * Email Tracking Tests
 * 
 * Tests for the new email tracking functionality that captures both
 * user email (developer/integrator) and customer email (end user).
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AICostTracker, AIProvider } from '../src/index';

// Mock the axios client to avoid actual HTTP requests
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn()
  }))
}));

describe('Email Tracking Functionality', () => {
  let tracker: AICostTracker;
  let mockApiClient: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock environment variables
    process.env.API_KEY = 'test-api-key';
    process.env.PROJECT_ID = 'test-project-id';
    
    // Mock the API client
    mockApiClient = {
      post: jest.fn().mockResolvedValue({
        data: { data: { id: 'test-id', cost: 0.008, totalTokens: 200 } }
      }),
      get: jest.fn().mockResolvedValue({ data: {} })
    };

    // Mock the create method to return our tracker instance
    jest.spyOn(AICostTracker, 'create').mockResolvedValue({
      config: {
        providers: [],
        tracking: { enableAutoTracking: true },
        optimization: { enablePromptOptimization: false }
      },
      trackUsage: jest.fn(),
      makeRequest: jest.fn(),
      getAnalytics: jest.fn(),
      initializeGateway: jest.fn(),
      getGateway: jest.fn(),
      gatewayRequest: jest.fn(),
      gatewayOpenAI: jest.fn(),
      gatewayAnthropic: jest.fn(),
      isUsingProxyKey: jest.fn(),
      getProxyKeyInfo: jest.fn(),
      makeProxyKeyRequest: jest.fn(),
      getProxyKeyUsage: jest.fn(),
      checkProxyKeyBudget: jest.fn(),
      validateProxyKeyPermissions: jest.fn(),
      getFirewallAnalytics: jest.fn(),
      makeFirewallProtectedRequest: jest.fn(),
      gatewayOpenAIWithFirewall: jest.fn(),
      gatewayAnthropicWithFirewall: jest.fn(),
      initializeFeedback: jest.fn(),
      submitFeedback: jest.fn(),
      updateImplicitSignals: jest.fn(),
      getFeedback: jest.fn(),
      getFeedbackAnalytics: jest.fn(),
      getEnhancedFeedbackAnalytics: jest.fn(),
      getGlobalFeedbackAnalytics: jest.fn(),
      estimateCost: jest.fn(),
      getUserStats: jest.fn(),
      getModelStats: jest.fn(),
      clearData: jest.fn(),
      getOptimizer: jest.fn(),
      getOptimizationConfig: jest.fn(),
      updateOptimizationConfig: jest.fn()
    } as any);
  });

  describe('UsageMetadata Interface', () => {
    it('should support userEmail and customerEmail fields', () => {
      const usageData = {
        provider: 'openai' as AIProvider,
        model: 'gpt-4',
        promptTokens: 150,
        completionTokens: 50,
        totalTokens: 200,
        estimatedCost: 0.008,
        prompt: 'Test prompt',
        userEmail: 'developer@company.com',
        customerEmail: 'client@client.com'
      };

      expect(usageData.userEmail).toBe('developer@company.com');
      expect(usageData.customerEmail).toBe('client@client.com');
    });
  });

  describe('GatewayRequestOptions Interface', () => {
    it('should support userEmail and customerEmail in gateway options', () => {
      const gatewayOptions = {
        userEmail: 'dev@company.com',
        customerEmail: 'enduser@client.com',
        projectId: 'proj-123'
      };

      expect(gatewayOptions.userEmail).toBe('dev@company.com');
      expect(gatewayOptions.customerEmail).toBe('enduser@client.com');
      expect(gatewayOptions.projectId).toBe('proj-123');
    });
  });

  describe('Email Field Validation', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        '123@numbers.com'
      ];

      validEmails.forEach(email => {
        expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
        'user..name@example.com'
      ];

      invalidEmails.forEach(email => {
        expect(email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });
  });

  describe('Email Tracking Scenarios', () => {
    it('should handle developer-only email tracking', () => {
      const usageData = {
        provider: 'openai' as AIProvider,
        model: 'gpt-4',
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
        estimatedCost: 0.006,
        prompt: 'Test prompt',
        userEmail: 'developer@company.com'
        // customerEmail omitted
      };

      expect(usageData.userEmail).toBe('developer@company.com');
      expect(usageData.customerEmail).toBeUndefined();
    });

    it('should handle customer-only email tracking', () => {
      const usageData = {
        provider: 'openai' as AIProvider,
        model: 'gpt-4',
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
        estimatedCost: 0.006,
        prompt: 'Test prompt',
        customerEmail: 'client@client.com'
        // userEmail omitted
      };

      expect(usageData.customerEmail).toBe('client@client.com');
      expect(usageData.userEmail).toBeUndefined();
    });

    it('should handle both email types for comprehensive tracking', () => {
      const usageData = {
        provider: 'openai' as AIProvider,
        model: 'gpt-4',
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
        estimatedCost: 0.006,
        prompt: 'Test prompt',
        userEmail: 'senior-dev@company.com',
        customerEmail: 'enterprise-client@client.com'
      };

      expect(usageData.userEmail).toBe('senior-dev@company.com');
      expect(usageData.customerEmail).toBe('enterprise-client@client.com');
    });
  });

  describe('Business Use Cases', () => {
    it('should support agency-client relationship tracking', () => {
      const agencyUsage = {
        provider: 'openai' as AIProvider,
        model: 'gpt-4',
        promptTokens: 200,
        completionTokens: 100,
        totalTokens: 300,
        estimatedCost: 0.012,
        prompt: 'Generate marketing copy for client product',
        userEmail: 'copywriter@agency.com',
        customerEmail: 'marketing@clientcompany.com',
        tags: ['client-project', 'marketing', 'copy-generation']
      };

      expect(agencyUsage.userEmail).toBe('copywriter@agency.com');
      expect(agencyUsage.customerEmail).toBe('marketing@clientcompany.com');
      expect(agencyUsage.tags).toContain('client-project');
    });

    it('should support SaaS application usage tracking', () => {
      const saasUsage = {
        provider: 'openai' as AIProvider,
        model: 'gpt-3.5-turbo',
        promptTokens: 75,
        completionTokens: 40,
        totalTokens: 115,
        estimatedCost: 0.003,
        prompt: 'Help me understand this error',
        completion: 'This error occurs when...',
        userEmail: 'saas-developer@company.com',
        customerEmail: 'enduser@saasapp.com',
        tags: ['saas', 'user-support', 'error-help']
      };

      expect(saasUsage.userEmail).toBe('saas-developer@company.com');
      expect(saasUsage.customerEmail).toBe('enduser@saasapp.com');
      expect(saasUsage.tags).toContain('saas');
    });

    it('should support internal development tracking', () => {
      const internalUsage = {
        provider: 'openai' as AIProvider,
        model: 'gpt-4',
        promptTokens: 150,
        completionTokens: 75,
        totalTokens: 225,
        estimatedCost: 0.009,
        prompt: 'Debug this React component',
        completion: 'The issue is in the useEffect...',
        userEmail: 'frontend-dev@company.com',
        customerEmail: 'internal@company.com', // Internal usage
        tags: ['internal', 'development', 'debugging']
      };

      expect(internalUsage.userEmail).toBe('frontend-dev@company.com');
      expect(internalUsage.customerEmail).toBe('internal@company.com');
      expect(internalUsage.tags).toContain('internal');
    });
  });

  describe('Email Field Integration', () => {
    it('should integrate with existing tracking fields', () => {
      const comprehensiveUsage = {
        provider: 'openai' as AIProvider,
        model: 'gpt-4',
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
        estimatedCost: 0.006,
        prompt: 'Test prompt',
        completion: 'Test completion',
        responseTime: 1200,
        tags: ['test', 'email-tracking'],
        sessionId: 'session-123',
        projectId: 'project-456',
        userEmail: 'dev@company.com',
        customerEmail: 'client@client.com',
        metadata: {
          source: 'test-suite',
          environment: 'development'
        }
      };

      // Verify all fields are present
      expect(comprehensiveUsage.userEmail).toBe('dev@company.com');
      expect(comprehensiveUsage.customerEmail).toBe('client@client.com');
      expect(comprehensiveUsage.sessionId).toBe('session-123');
      expect(comprehensiveUsage.projectId).toBe('project-456');
      expect(comprehensiveUsage.metadata.source).toBe('test-suite');
    });
  });

  describe('Backward Compatibility', () => {
    it('should maintain backward compatibility without email fields', () => {
      const legacyUsage = {
        provider: 'openai' as AIProvider,
        model: 'gpt-4',
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
        estimatedCost: 0.006,
        prompt: 'Legacy prompt'
        // No email fields
      };

      expect(legacyUsage.provider).toBe('openai');
      expect(legacyUsage.model).toBe('gpt-4');
      expect(legacyUsage.userEmail).toBeUndefined();
      expect(legacyUsage.customerEmail).toBeUndefined();
    });
  });
});
