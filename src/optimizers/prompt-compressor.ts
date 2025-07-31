import { OptimizationSuggestion, AIProvider } from '../types';
import { TokenCounter } from '../analyzers/token-counter';
import { v4 as uuidv4 } from 'uuid';

export class PromptCompressor {
  private compressionPatterns: Map<string, string> = new Map();
  private patternCounter = 0;

  async compressPrompt(
    prompt: string,
    targetModel: string,
    targetProvider: AIProvider
  ): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];

    // 1. JSON Compression
    const jsonCompression = await this.compressJSON(prompt, targetModel, targetProvider);
    if (jsonCompression) suggestions.push(jsonCompression);

    // 2. Pattern Replacement
    const patternCompression = await this.compressPatterns(prompt, targetModel, targetProvider);
    if (patternCompression) suggestions.push(patternCompression);

    // 3. Abbreviation
    const abbreviationCompression = await this.compressWithAbbreviations(
      prompt,
      targetModel,
      targetProvider
    );
    if (abbreviationCompression) suggestions.push(abbreviationCompression);

    // 4. Deduplication
    const deduplicationCompression = await this.deduplicateContent(
      prompt,
      targetModel,
      targetProvider
    );
    if (deduplicationCompression) suggestions.push(deduplicationCompression);

    return suggestions.sort((a, b) => b.estimatedSavings - a.estimatedSavings);
  }

  private async compressJSON(
    prompt: string,
    targetModel: string,
    targetProvider: AIProvider
  ): Promise<OptimizationSuggestion | null> {
    // Find JSON objects in the prompt
    const jsonRegex = /\{[\s\S]*?\}/g;
    const jsonMatches = prompt.match(jsonRegex);

    if (!jsonMatches || jsonMatches.length === 0) return null;

    let compressedPrompt = prompt;
    let totalSaved = 0;

    for (const jsonStr of jsonMatches) {
      try {
        const json = JSON.parse(jsonStr);

        // Compress by removing whitespace and using shorter keys
        const compressed = this.compressJSONObject(json);
        const compressedStr = JSON.stringify(compressed);

        if (compressedStr.length < jsonStr.length * 0.7) {
          // Create a reference system for the compressed JSON
          const ref = `$JSON_REF_${this.patternCounter++}$`;
          this.compressionPatterns.set(ref, compressedStr);

          // Add decompression instructions at the beginning
          const decompressionNote = `[Note: ${ref} = ${compressedStr}]\n`;
          compressedPrompt = decompressionNote + compressedPrompt.replace(jsonStr, ref);

          totalSaved += jsonStr.length - ref.length - decompressionNote.length;
        }
      } catch (e) {
        // Not valid JSON, skip
        continue;
      }
    }

    if (totalSaved <= 0) return null;

    const originalTokens = await TokenCounter.countTokens(prompt, targetProvider, targetModel);
    const compressedTokens = await TokenCounter.countTokens(
      compressedPrompt,
      targetProvider,
      targetModel
    );
    const savings = ((originalTokens - compressedTokens) / originalTokens) * 100;

    return {
      id: uuidv4(),
      type: 'compression',
      originalPrompt: prompt,
      optimizedPrompt: compressedPrompt,
      estimatedSavings: savings,
      confidence: 0.9,
      explanation: 'Compressed JSON data by removing whitespace and using reference system',
      implementation: 'JSON compression with reference mapping',
      compressionDetails: {
        technique: 'json_compression',
        originalSize: prompt.length,
        compressedSize: compressedPrompt.length,
        compressionRatio: compressedPrompt.length / prompt.length,
        reversible: true
      }
    };
  }

  private compressJSONObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.compressJSONObject(item));
    } else if (obj !== null && typeof obj === 'object') {
      const compressed: any = {};
      for (const [key, value] of Object.entries(obj)) {
        // Use abbreviated keys for common patterns
        const shortKey = this.abbreviateKey(key);
        compressed[shortKey] = this.compressJSONObject(value);
      }
      return compressed;
    }
    return obj;
  }

  private abbreviateKey(key: string): string {
    const abbreviations: Record<string, string> = {
      description: 'desc',
      configuration: 'cfg',
      properties: 'props',
      attributes: 'attrs',
      parameters: 'params',
      response: 'resp',
      request: 'req',
      message: 'msg',
      timestamp: 'ts',
      identifier: 'id',
      maximum: 'max',
      minimum: 'min',
      average: 'avg'
    };

    return abbreviations[key.toLowerCase()] || key;
  }

  private async compressPatterns(
    prompt: string,
    targetModel: string,
    targetProvider: AIProvider
  ): Promise<OptimizationSuggestion | null> {
    // Find repeated patterns (min 20 chars, repeated 3+ times)
    const patterns = this.findRepeatedPatterns(prompt, 20, 3);

    if (patterns.length === 0) return null;

    let compressedPrompt = prompt;
    let totalSaved = 0;

    for (const pattern of patterns) {
      const ref = `$PATTERN_${this.patternCounter++}$`;
      const occurrences = (prompt.match(new RegExp(this.escapeRegex(pattern), 'g')) || []).length;

      // Only compress if we save significant space
      if (pattern.length * occurrences > pattern.length + ref.length * occurrences + 50) {
        const definition = `[${ref} = "${pattern}"]\n`;
        compressedPrompt = definition + compressedPrompt.split(pattern).join(ref);
        totalSaved +=
          pattern.length * (occurrences - 1) - ref.length * occurrences - definition.length;
      }
    }

    if (totalSaved <= 0) return null;

    const originalTokens = await TokenCounter.countTokens(prompt, targetProvider, targetModel);
    const compressedTokens = await TokenCounter.countTokens(
      compressedPrompt,
      targetProvider,
      targetModel
    );
    const savings = ((originalTokens - compressedTokens) / originalTokens) * 100;

    return {
      id: uuidv4(),
      type: 'compression',
      originalPrompt: prompt,
      optimizedPrompt: compressedPrompt,
      estimatedSavings: savings,
      confidence: 0.85,
      explanation: `Replaced ${patterns.length} repeated patterns with references`,
      implementation: 'Pattern replacement compression',
      compressionDetails: {
        technique: 'pattern_replacement',
        originalSize: prompt.length,
        compressedSize: compressedPrompt.length,
        compressionRatio: compressedPrompt.length / prompt.length,
        reversible: true
      }
    };
  }

  private findRepeatedPatterns(text: string, minLength: number, minOccurrences: number): string[] {
    const patterns: Map<string, number> = new Map();

    // Sliding window to find repeated substrings
    for (let length = minLength; length <= Math.min(100, text.length / minOccurrences); length++) {
      for (let i = 0; i <= text.length - length; i++) {
        const substring = text.substr(i, length);
        patterns.set(substring, (patterns.get(substring) || 0) + 1);
      }
    }

    // Filter patterns that occur at least minOccurrences times
    return Array.from(patterns.entries())
      .filter(([_, count]) => count >= minOccurrences)
      .sort((a, b) => b[0].length * b[1] - a[0].length * a[1])
      .slice(0, 5)
      .map(([pattern]) => pattern);
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private async compressWithAbbreviations(
    prompt: string,
    targetModel: string,
    targetProvider: AIProvider
  ): Promise<OptimizationSuggestion | null> {
    const commonPhrases: Record<string, string> = {
      'for example': 'e.g.',
      'that is': 'i.e.',
      'and so on': 'etc.',
      versus: 'vs.',
      approximately: '~',
      'greater than': '>',
      'less than': '<',
      'equal to': '=',
      'not equal to': '!=',
      please: 'pls',
      thanks: 'thx',
      information: 'info',
      configuration: 'config',
      environment: 'env',
      development: 'dev',
      production: 'prod',
      application: 'app',
      database: 'db',
      administrator: 'admin'
    };

    let compressedPrompt = prompt;
    let replacements = 0;

    for (const [phrase, abbrev] of Object.entries(commonPhrases)) {
      const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
      const matches = (prompt.match(regex) || []).length;
      if (matches > 0) {
        compressedPrompt = compressedPrompt.replace(regex, abbrev);
        replacements += matches;
      }
    }

    if (replacements === 0) return null;

    const originalTokens = await TokenCounter.countTokens(prompt, targetProvider, targetModel);
    const compressedTokens = await TokenCounter.countTokens(
      compressedPrompt,
      targetProvider,
      targetModel
    );
    const savings = ((originalTokens - compressedTokens) / originalTokens) * 100;

    if (savings < 5) return null;

    return {
      id: uuidv4(),
      type: 'compression',
      originalPrompt: prompt,
      optimizedPrompt: compressedPrompt,
      estimatedSavings: savings,
      confidence: 0.7,
      explanation: `Replaced ${replacements} common phrases with abbreviations`,
      implementation: 'Common phrase abbreviation',
      tradeoffs: 'May slightly reduce readability for complex prompts',
      compressionDetails: {
        technique: 'abbreviation',
        originalSize: prompt.length,
        compressedSize: compressedPrompt.length,
        compressionRatio: compressedPrompt.length / prompt.length,
        reversible: false
      }
    };
  }

  private async deduplicateContent(
    prompt: string,
    targetModel: string,
    targetProvider: AIProvider
  ): Promise<OptimizationSuggestion | null> {
    // Split into sentences and find duplicates
    const sentences = prompt
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 10);
    const uniqueSentences: string[] = [];
    const duplicates: Map<string, number> = new Map();

    for (const sentence of sentences) {
      const normalized = sentence.toLowerCase();
      if (duplicates.has(normalized)) {
        duplicates.set(normalized, duplicates.get(normalized)! + 1);
      } else {
        duplicates.set(normalized, 1);
        uniqueSentences.push(sentence);
      }
    }

    const hasDuplicates = Array.from(duplicates.values()).some(count => count > 1);
    if (!hasDuplicates) return null;

    const deduplicatedPrompt = uniqueSentences.join('. ') + '.';

    const originalTokens = await TokenCounter.countTokens(prompt, targetProvider, targetModel);
    const deduplicatedTokens = await TokenCounter.countTokens(
      deduplicatedPrompt,
      targetProvider,
      targetModel
    );
    const savings = ((originalTokens - deduplicatedTokens) / originalTokens) * 100;

    if (savings < 5) return null;

    const totalDuplicates = Array.from(duplicates.values()).reduce(
      (sum, count) => sum + Math.max(0, count - 1),
      0
    );

    return {
      id: uuidv4(),
      type: 'compression',
      originalPrompt: prompt,
      optimizedPrompt: deduplicatedPrompt,
      estimatedSavings: savings,
      confidence: 0.95,
      explanation: `Removed ${totalDuplicates} duplicate sentences`,
      implementation: 'Sentence deduplication',
      compressionDetails: {
        technique: 'deduplication',
        originalSize: prompt.length,
        compressedSize: deduplicatedPrompt.length,
        compressionRatio: deduplicatedPrompt.length / prompt.length,
        reversible: false
      }
    };
  }
}
