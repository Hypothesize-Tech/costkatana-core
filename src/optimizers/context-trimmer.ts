import { OptimizationSuggestion, AIProvider, BedrockConfig } from '../types';
import { TokenCounter } from '../analyzers/token-counter';
import { BedrockProvider } from '../providers/bedrock';
import { v4 as uuidv4 } from 'uuid';

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  importance?: number;
}

export class ContextTrimmer {
  private bedrockProvider?: BedrockProvider;
  private summarizationModel: string;

  constructor(bedrockConfig?: BedrockConfig) {
    this.summarizationModel = bedrockConfig?.modelId || 'anthropic.claude-3-haiku-20240307-v1:0';

    if (bedrockConfig) {
      this.bedrockProvider = new BedrockProvider({
        provider: AIProvider.AWSBedrock,
        region: bedrockConfig.region,
        optimization: {
          enablePromptOptimization: true,
          enableModelSuggestions: true,
          enableCachingSuggestions: true,
          bedrockConfig,
          thresholds: {
            highCostPerRequest: 1,
            highTokenUsage: 1000,
            frequencyThreshold: 5
          }
        }
      });
    }
  }

  async trimContext(
    messages: ConversationMessage[],
    targetModel: string,
    targetProvider: AIProvider,
    maxContextLength: number = 4000,
    preserveRecentMessages: number = 3
  ): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];

    // Calculate current context size
    const currentContext = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    const currentTokens = await TokenCounter.countTokens(
      currentContext,
      targetProvider,
      targetModel
    );

    if (currentTokens <= maxContextLength) {
      return []; // No trimming needed
    }

    // 1. Sliding Window
    const slidingWindowSuggestion = await this.applySlidingWindow(
      messages,
      targetModel,
      targetProvider,
      preserveRecentMessages
    );
    if (slidingWindowSuggestion) suggestions.push(slidingWindowSuggestion);

    // 2. Relevance Filtering
    const relevanceFilteringSuggestion = await this.applyRelevanceFiltering(
      messages,
      targetModel,
      targetProvider
    );
    if (relevanceFilteringSuggestion) suggestions.push(relevanceFilteringSuggestion);

    // 3. Summarization (if Bedrock is available)
    if (this.bedrockProvider) {
      const summarizationSuggestion = await this.applySummarization(
        messages,
        targetModel,
        targetProvider,
        preserveRecentMessages
      );
      if (summarizationSuggestion) suggestions.push(summarizationSuggestion);
    }

    // 4. Importance Scoring
    const importanceSuggestion = await this.applyImportanceScoring(
      messages,
      targetModel,
      targetProvider,
      preserveRecentMessages
    );
    if (importanceSuggestion) suggestions.push(importanceSuggestion);

    return suggestions.sort((a, b) => b.estimatedSavings - a.estimatedSavings);
  }

  private async applySlidingWindow(
    messages: ConversationMessage[],
    targetModel: string,
    targetProvider: AIProvider,
    preserveRecentMessages: number
  ): Promise<OptimizationSuggestion | null> {
    if (messages.length <= preserveRecentMessages) return null;

    // Keep only the most recent messages
    const trimmedMessages = messages.slice(-preserveRecentMessages);
    const trimmedContext = trimmedMessages.map(m => `${m.role}: ${m.content}`).join('\n');

    const originalContext = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    const originalTokens = await TokenCounter.countTokens(
      originalContext,
      targetProvider,
      targetModel
    );
    const trimmedTokens = await TokenCounter.countTokens(
      trimmedContext,
      targetProvider,
      targetModel
    );

    const savings = ((originalTokens - trimmedTokens) / originalTokens) * 100;

    return {
      id: uuidv4(),
      type: 'context_trimming',
      originalPrompt: originalContext,
      optimizedPrompt: trimmedContext,
      estimatedSavings: savings,
      confidence: 0.9,
      explanation: `Kept only the ${preserveRecentMessages} most recent messages using sliding window`,
      implementation: 'Sliding window context trimming',
      contextTrimDetails: {
        technique: 'sliding_window',
        originalMessages: messages.length,
        trimmedMessages: trimmedMessages.length,
        preservedContext: trimmedMessages.map(m => m.role)
      }
    };
  }

  private async applyRelevanceFiltering(
    messages: ConversationMessage[],
    targetModel: string,
    targetProvider: AIProvider
  ): Promise<OptimizationSuggestion | null> {
    // Filter out system messages and short acknowledgments
    const irrelevantPatterns = [
      /^(ok|okay|sure|yes|no|thanks|thank you|got it|understood|i see)\.?$/i,
      /^(hmm|uh|um|well|oh|ah)\.?$/i,
      /^\.{3,}$/
    ];

    const filteredMessages = messages.filter((msg, index) => {
      // Always keep the last few messages for context
      if (index >= messages.length - 2) return true;

      // Always keep system messages
      if (msg.role === 'system') return true;

      // Filter out irrelevant content
      const content = msg.content.trim();
      return !irrelevantPatterns.some(pattern => pattern.test(content));
    });

    if (filteredMessages.length === messages.length) return null;

    const originalContext = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    const filteredContext = filteredMessages.map(m => `${m.role}: ${m.content}`).join('\n');

    const originalTokens = await TokenCounter.countTokens(
      originalContext,
      targetProvider,
      targetModel
    );
    const filteredTokens = await TokenCounter.countTokens(
      filteredContext,
      targetProvider,
      targetModel
    );

    const savings = ((originalTokens - filteredTokens) / originalTokens) * 100;

    return {
      id: uuidv4(),
      type: 'context_trimming',
      originalPrompt: originalContext,
      optimizedPrompt: filteredContext,
      estimatedSavings: savings,
      confidence: 0.8,
      explanation: `Removed ${messages.length - filteredMessages.length} irrelevant messages`,
      implementation: 'Relevance-based filtering',
      contextTrimDetails: {
        technique: 'relevance_filtering',
        originalMessages: messages.length,
        trimmedMessages: filteredMessages.length,
        preservedContext: filteredMessages.map(m => `${m.role} (${m.content.substring(0, 20)}...)`)
      }
    };
  }

  private async applySummarization(
    messages: ConversationMessage[],
    targetModel: string,
    targetProvider: AIProvider,
    preserveRecentMessages: number
  ): Promise<OptimizationSuggestion | null> {
    if (!this.bedrockProvider || messages.length <= preserveRecentMessages + 2) return null;

    // Split messages into old (to summarize) and recent (to preserve)
    const messagesToSummarize = messages.slice(0, -preserveRecentMessages);
    const recentMessages = messages.slice(-preserveRecentMessages);

    const conversationToSummarize = messagesToSummarize
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');

    const summarizationPrompt = `Please provide a concise summary of the following conversation, preserving key information, decisions, and context needed for continuation:

${conversationToSummarize}

Provide a summary in 2-3 paragraphs that captures the essential information.`;

    try {
      const response = await this.bedrockProvider.makeRequest({
        model: this.summarizationModel,
        prompt: summarizationPrompt,
        maxTokens: 500,
        temperature: 0.3
      });

      const summary = response.choices[0]?.text || '';

      // Create new context with summary + recent messages
      const summarizedContext = `Previous conversation summary:\n${summary}\n\nRecent messages:\n${recentMessages.map(m => `${m.role}: ${m.content}`).join('\n')}`;

      const originalContext = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      const originalTokens = await TokenCounter.countTokens(
        originalContext,
        targetProvider,
        targetModel
      );
      const summarizedTokens = await TokenCounter.countTokens(
        summarizedContext,
        targetProvider,
        targetModel
      );

      const savings = ((originalTokens - summarizedTokens) / originalTokens) * 100;

      if (savings < 20) return null;

      return {
        id: uuidv4(),
        type: 'context_trimming',
        originalPrompt: originalContext,
        optimizedPrompt: summarizedContext,
        estimatedSavings: savings,
        confidence: 0.85,
        explanation: `Summarized ${messagesToSummarize.length} older messages, preserved ${recentMessages.length} recent ones`,
        implementation: 'AI-powered conversation summarization',
        tradeoffs: 'Some nuanced details may be lost in summarization',
        contextTrimDetails: {
          technique: 'summarization',
          originalMessages: messages.length,
          trimmedMessages: recentMessages.length + 1, // +1 for summary
          preservedContext: ['summary', ...recentMessages.map(m => m.role)]
        }
      };
    } catch (error) {
      console.error('Summarization failed:', error);
      return null;
    }
  }

  private async applyImportanceScoring(
    messages: ConversationMessage[],
    targetModel: string,
    targetProvider: AIProvider,
    preserveRecentMessages: number
  ): Promise<OptimizationSuggestion | null> {
    // Score messages based on importance criteria
    const scoredMessages = messages.map((msg, index) => {
      let score = 0;

      // Recent messages are more important
      score += ((messages.length - index) / messages.length) * 30;

      // System messages are important
      if (msg.role === 'system') score += 40;

      // Longer messages tend to be more substantive
      score += Math.min(msg.content.length / 100, 20);

      // Messages with code, lists, or structured data
      if (/```|^\s*[-*]\s|^\s*\d+\.|{|}|\[|\]/.test(msg.content)) score += 20;

      // Messages with questions
      if (/\?/.test(msg.content)) score += 15;

      // Messages with specific keywords
      const importantKeywords = [
        'important',
        'critical',
        'must',
        'required',
        'error',
        'problem',
        'issue'
      ];
      if (importantKeywords.some(keyword => msg.content.toLowerCase().includes(keyword)))
        score += 25;

      return { ...msg, importance: score };
    });

    // Sort by importance and select top messages
    const sortedMessages = scoredMessages.sort((a, b) => b.importance! - a.importance!);

    // Always include recent messages
    const recentMessages = messages.slice(-preserveRecentMessages);
    const importantMessages = sortedMessages.slice(0, Math.max(5, messages.length / 2));

    // Merge and deduplicate
    const selectedMessages = Array.from(new Set([...importantMessages, ...recentMessages])).sort(
      (a, b) => messages.indexOf(a) - messages.indexOf(b)
    );

    if (selectedMessages.length === messages.length) return null;

    const originalContext = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    const trimmedContext = selectedMessages.map(m => `${m.role}: ${m.content}`).join('\n');

    const originalTokens = await TokenCounter.countTokens(
      originalContext,
      targetProvider,
      targetModel
    );
    const trimmedTokens = await TokenCounter.countTokens(
      trimmedContext,
      targetProvider,
      targetModel
    );

    const savings = ((originalTokens - trimmedTokens) / originalTokens) * 100;

    return {
      id: uuidv4(),
      type: 'context_trimming',
      originalPrompt: originalContext,
      optimizedPrompt: trimmedContext,
      estimatedSavings: savings,
      confidence: 0.75,
      explanation: `Kept ${selectedMessages.length} most important messages based on scoring`,
      implementation: 'Importance-based message selection',
      contextTrimDetails: {
        technique: 'importance_scoring',
        originalMessages: messages.length,
        trimmedMessages: selectedMessages.length,
        preservedContext: selectedMessages.map(
          m => `${m.role} (score: ${m.importance?.toFixed(0)})`
        )
      }
    };
  }
}
