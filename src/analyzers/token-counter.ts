import { encode } from 'gpt-3-encoder';
import { AIProvider } from '../types';

export class TokenCounter {
  /**
   * Count tokens for a given text based on the provider and model
   */
  static countTokens(text: string, provider: AIProvider, _model: string): number {
    switch (provider) {
      case AIProvider.OpenAI:
        return this.countOpenAITokens(text);
      case AIProvider.AWSBedrock:
      case AIProvider.Anthropic:
        return this.countClaudeTokens(text);
      case AIProvider.Google:
        return this.countGoogleTokens(text);
      case AIProvider.Cohere:
        return this.countCohereTokens(text);
      default:
        return this.countGenericTokens(text);
    }
  }

  /**
   * Count tokens for OpenAI models using gpt-3-encoder
   */
  private static countOpenAITokens(text: string): number {
    try {
      const encoded = encode(text);
      return encoded.length;
    } catch (error) {
      // Fallback for unsupported models
      console.warn('Token counting failed for OpenAI model:', error);
      return this.countGenericTokens(text);
    }
  }

  /**
   * Count tokens for Claude models (Anthropic/Bedrock)
   * Claude uses a different tokenizer, approximate based on character count
   */
  private static countClaudeTokens(text: string): number {
    // Claude's tokenizer is roughly 1 token per 3.5 characters
    return Math.ceil(text.length / 3.5);
  }

  /**
   * Count tokens for Google models
   * Approximation based on typical patterns
   */
  private static countGoogleTokens(text: string): number {
    // Google models typically use ~1 token per 4 characters
    return Math.ceil(text.length / 4);
  }

  /**
   * Count tokens for Cohere models
   * Approximation based on typical patterns
   */
  private static countCohereTokens(text: string): number {
    // Cohere models typically use ~1 token per 3.8 characters
    return Math.ceil(text.length / 3.8);
  }

  /**
   * Generic token counting fallback
   * Uses a conservative estimate
   */
  private static countGenericTokens(text: string): number {
    // Conservative estimate: 1 token per 4 characters
    return Math.ceil(text.length / 4);
  }

  /**
   * Estimate tokens for a conversation (array of messages)
   */
  static countConversationTokens(
    messages: Array<{ role: string; content: string }>,
    provider: AIProvider,
    model: string
  ): number {
    let totalTokens = 0;

    // Add tokens for message formatting overhead
    const messageOverhead = provider === AIProvider.OpenAI ? 4 : 3;

    for (const message of messages) {
      const contentTokens = this.countTokens(message.content, provider, model);

      // Add role tokens
      const roleTokens = this.countTokens(message.role, provider, model);

      totalTokens += contentTokens + roleTokens + messageOverhead;
    }

    // Add conversation overhead
    const conversationOverhead = provider === AIProvider.OpenAI ? 3 : 2;
    totalTokens += conversationOverhead;

    return totalTokens;
  }

  /**
   * Split text into chunks that fit within token limit
   */
  static splitTextByTokens(
    text: string,
    maxTokens: number,
    provider: AIProvider,
    model: string,
    overlap: number = 0
  ): string[] {
    const chunks: string[] = [];
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    let currentChunk = '';
    let currentTokens = 0;

    for (const sentence of sentences) {
      const sentenceTokens = this.countTokens(sentence, provider, model);

      if (currentTokens + sentenceTokens > maxTokens && currentChunk) {
        chunks.push(currentChunk.trim());

        // Handle overlap
        if (overlap > 0) {
          const overlapSentences = currentChunk
            .split(/[.!?]+/)
            .filter(s => s.trim())
            .slice(-overlap);
          currentChunk = `${overlapSentences.join('. ')}. `;
          currentTokens = this.countTokens(currentChunk, provider, model);
        } else {
          currentChunk = '';
          currentTokens = 0;
        }
      }

      currentChunk += sentence;
      currentTokens += sentenceTokens;
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  /**
   * Estimate token reduction from prompt optimization
   */
  static estimateOptimizationSavings(
    originalPrompt: string,
    optimizedPrompt: string,
    provider: AIProvider,
    model: string
  ): {
    originalTokens: number;
    optimizedTokens: number;
    savedTokens: number;
    savingsPercentage: number;
  } {
    const originalTokens = this.countTokens(originalPrompt, provider, model);

    const optimizedTokens = this.countTokens(optimizedPrompt, provider, model);

    const savedTokens = originalTokens - optimizedTokens;
    const savingsPercentage = (savedTokens / originalTokens) * 100;

    return {
      originalTokens,
      optimizedTokens,
      savedTokens,
      savingsPercentage
    };
  }
}
