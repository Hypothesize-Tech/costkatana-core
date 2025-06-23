import { OptimizationSuggestion, BedrockConfig, AIProvider } from '../types';
import { BedrockProvider } from '../providers/bedrock';
import { TokenCounter } from '../analyzers/token-counter';
import { v4 as uuidv4 } from 'uuid';

export class PromptOptimizer {
  private bedrockProvider?: BedrockProvider;
  private optimizationModel: string;

  constructor(bedrockConfig?: BedrockConfig) {
    this.optimizationModel = bedrockConfig?.modelId || 'anthropic.claude-3-5-sonnet-20240620-v1:0';

    if (bedrockConfig) {
      this.bedrockProvider = new BedrockProvider({
        provider: AIProvider.AWSBedrock,
        region: bedrockConfig.region,
        optimization: {
          enablePromptOptimization: true,
          enableModelSuggestions: true,
          enableCachingSuggestions: true,
          bedrockConfig
        }
      });
    }
  }

  async optimizePrompt(
    prompt: string,
    targetModel: string,
    targetProvider: AIProvider,
    context?: {
      previousPrompts?: string[];
      expectedOutput?: string;
      constraints?: string[];
    }
  ): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];

    // Local optimizations (no AI required)
    suggestions.push(...(await this.getLocalOptimizations(prompt, targetModel, targetProvider)));

    // AI-powered optimizations (if Bedrock is configured)
    if (this.bedrockProvider) {
      suggestions.push(
        ...(await this.getAIOptimizations(prompt, targetModel, targetProvider, context))
      );
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  private async getLocalOptimizations(
    prompt: string,
    targetModel: string,
    targetProvider: AIProvider
  ): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];

    // 1. Remove redundant whitespace
    const cleanedPrompt = prompt.replace(/\s+/g, ' ').trim();
    if (cleanedPrompt.length < prompt.length) {
      const savings = await this.calculateSavings(
        prompt,
        cleanedPrompt,
        targetProvider,
        targetModel
      );

      suggestions.push({
        id: uuidv4(),
        type: 'prompt',
        originalPrompt: prompt,
        optimizedPrompt: cleanedPrompt,
        estimatedSavings: savings.savingsPercentage,
        confidence: 1.0,
        explanation: 'Removed redundant whitespace and formatting',
        implementation: "prompt.replace(/\\s+/g, ' ').trim()"
      });
    }

    // 2. Remove filler words
    const fillerWords = [
      'basically',
      'actually',
      'really',
      'just',
      'very',
      'quite',
      'rather',
      'somewhat',
      'fairly',
      'pretty'
    ];

    let optimizedPrompt = prompt;
    fillerWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      optimizedPrompt = optimizedPrompt.replace(regex, '');
    });
    optimizedPrompt = optimizedPrompt.replace(/\s+/g, ' ').trim();

    if (optimizedPrompt.length < prompt.length * 0.95) {
      const savings = await this.calculateSavings(
        prompt,
        optimizedPrompt,
        targetProvider,
        targetModel
      );

      suggestions.push({
        id: uuidv4(),
        type: 'prompt',
        originalPrompt: prompt,
        optimizedPrompt,
        estimatedSavings: savings.savingsPercentage,
        confidence: 0.8,
        explanation: 'Removed filler words without changing meaning',
        implementation: `Remove words: ${fillerWords.join(', ')}`
      });
    }

    // 3. Suggest concise alternatives
    if (prompt.length > 500) {
      suggestions.push({
        id: uuidv4(),
        type: 'prompt',
        estimatedSavings: 30,
        confidence: 0.6,
        explanation:
          'Long prompts can often be made more concise. Consider breaking down into bullet points or using more precise language.',
        implementation:
          'Use bullet points:\n• Main objective\n• Key constraints\n• Expected output format'
      });
    }

    // 4. Check for repeated instructions
    const sentences = prompt.split(/[.!?]+/);
    const uniqueSentences = [...new Set(sentences)];
    if (uniqueSentences.length < sentences.length) {
      const deduplicatedPrompt = uniqueSentences.join('. ').trim();
      const savings = await this.calculateSavings(
        prompt,
        deduplicatedPrompt,
        targetProvider,
        targetModel
      );

      suggestions.push({
        id: uuidv4(),
        type: 'prompt',
        originalPrompt: prompt,
        optimizedPrompt: deduplicatedPrompt,
        estimatedSavings: savings.savingsPercentage,
        confidence: 0.9,
        explanation: 'Removed duplicate instructions',
        implementation: 'Deduplicate sentences'
      });
    }

    return suggestions;
  }

  private async getAIOptimizations(
    prompt: string,
    targetModel: string,
    targetProvider: AIProvider,
    context?: any
  ): Promise<OptimizationSuggestion[]> {
    if (!this.bedrockProvider) return [];

    const optimizationPrompt = `You are an expert prompt engineer. Analyze the following prompt and provide optimization suggestions to reduce token count while maintaining or improving effectiveness.
  
  Original Prompt:
  "${prompt}"
  
  Target Model: ${targetModel}
  Target Provider: ${targetProvider}
  ${context?.constraints ? `Constraints: ${context.constraints.join(', ')}` : ''}
  ${context?.expectedOutput ? `Expected Output Type: ${context.expectedOutput}` : ''}
  
  Provide your response in JSON format with the following structure:
  {
    "optimizations": [
      {
        "optimizedPrompt": "the optimized version",
        "explanation": "why this optimization works",
        "estimatedTokenReduction": 25,
        "confidence": 0.85,
        "tradeoffs": "any potential downsides"
      }
    ],
    "generalTips": ["tip1", "tip2"],
    "modelSpecificAdvice": "advice specific to the target model"
  }`;

    try {
      const response = await this.bedrockProvider.makeRequest({
        model: this.optimizationModel,
        prompt: optimizationPrompt,
        maxTokens: 1000,
        temperature: 0.3
      });

      const responseText = response.choices[0]?.text || '';
      const analysis = JSON.parse(responseText);

      const suggestions: OptimizationSuggestion[] = [];

      for (const opt of analysis.optimizations || []) {
        const savings = await this.calculateSavings(
          prompt,
          opt.optimizedPrompt,
          targetProvider,
          targetModel
        );

        suggestions.push({
          id: uuidv4(),
          type: 'prompt',
          originalPrompt: prompt,
          optimizedPrompt: opt.optimizedPrompt,
          estimatedSavings: savings.savingsPercentage,
          confidence: opt.confidence || 0.7,
          explanation: opt.explanation,
          implementation: opt.tradeoffs || 'AI-optimized prompt'
        });
      }

      // Add general tips as a suggestion
      if (analysis.generalTips && analysis.generalTips.length > 0) {
        suggestions.push({
          id: uuidv4(),
          type: 'prompt',
          estimatedSavings: 15,
          confidence: 0.5,
          explanation: `General optimization tips: ${analysis.generalTips.join('; ')}`,
          implementation: analysis.modelSpecificAdvice || 'Apply the suggested tips'
        });
      }

      return suggestions;
    } catch (error) {
      console.error('AI optimization failed:', error);
      return [];
    }
  }

  async suggestBatching(
    prompts: string[],
    targetModel: string,
    targetProvider: AIProvider
  ): Promise<OptimizationSuggestion> {
    if (prompts.length < 2) {
      return {
        id: uuidv4(),
        type: 'batching',
        estimatedSavings: 0,
        confidence: 0,
        explanation: 'Batching requires multiple prompts',
        implementation: 'No batching opportunity'
      };
    }

    // Calculate individual costs
    let individualCost = 0;
    for (const prompt of prompts) {
      const tokens = await TokenCounter.countTokens(prompt, targetProvider, targetModel);
      individualCost += tokens;
    }

    // Calculate batched cost
    const batchedPrompt = prompts.join('\n\n---\n\n');
    const batchedTokens = await TokenCounter.countTokens(
      batchedPrompt,
      targetProvider,
      targetModel
    );

    const savingsPercentage = ((individualCost - batchedTokens) / individualCost) * 100;

    return {
      id: uuidv4(),
      type: 'batching',
      estimatedSavings: savingsPercentage,
      confidence: 0.9,
      explanation: `Batch ${prompts.length} requests into one to save on overhead tokens`,
      implementation: `Combine prompts with separator:\n${prompts.map((p, i) => `${i + 1}. ${p.substring(0, 50)}...`).join('\n')}`
    };
  }

  async suggestCaching(
    frequency: number,
    _avgResponseTokens: number
  ): Promise<OptimizationSuggestion> {
    const monthlyCallCost = frequency * 30; // Assuming frequency is daily
    const estimatedMonthlySavings = monthlyCallCost * 0.95; // 95% savings with caching

    return {
      id: uuidv4(),
      type: 'caching',
      estimatedSavings: estimatedMonthlySavings,
      confidence: frequency > 5 ? 0.95 : 0.7,
      explanation: `This prompt is used ${frequency} times per day. Caching responses would save ~${estimatedMonthlySavings.toFixed(0)}% of costs.`,
      implementation: 'Implement response caching with TTL based on data freshness requirements'
    };
  }

  async suggestModelDowngrade(
    currentModel: string,
    taskComplexity: 'simple' | 'moderate' | 'complex'
  ): Promise<OptimizationSuggestion | null> {
    const modelSuggestions: Record<string, { downgrade: string; savings: number }> = {
      'gpt-4': { downgrade: 'gpt-3.5-turbo', savings: 95 },
      'gpt-4-turbo-preview': { downgrade: 'gpt-3.5-turbo', savings: 95 },
      'claude-3-opus': { downgrade: 'claude-3-sonnet', savings: 80 },
      'claude-3-sonnet': { downgrade: 'claude-3-haiku', savings: 92 }
    };

    const suggestion = modelSuggestions[currentModel];
    if (!suggestion || taskComplexity === 'complex') {
      return null;
    }

    const confidence = taskComplexity === 'simple' ? 0.9 : 0.6;

    return {
      id: uuidv4(),
      type: 'model',
      estimatedSavings: suggestion.savings,
      confidence,
      explanation: `For ${taskComplexity} tasks, ${suggestion.downgrade} should provide similar quality at ${suggestion.savings}% lower cost`,
      implementation: `Change model from ${currentModel} to ${suggestion.downgrade}`
    };
  }

  private async calculateSavings(
    originalPrompt: string,
    optimizedPrompt: string,
    provider: AIProvider,
    model: string
  ) {
    return await TokenCounter.estimateOptimizationSavings(
      originalPrompt,
      optimizedPrompt,
      provider,
      model
    );
  }
}
