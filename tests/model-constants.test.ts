/**
 * Model Constants Tests
 * Test the type-safe model constants functionality
 */

import {
  OPENAI,
  ANTHROPIC,
  GOOGLE,
  AWS_BEDROCK,
  XAI,
  DEEPSEEK,
  MISTRAL,
  COHERE,
  GROQ,
  META,
  isModelConstant,
  getAllModelConstants,
  getProviderFromModel
} from '../src';

describe('Model Constants', () => {
  describe('OPENAI namespace', () => {
    it('should have GPT-4 constant', () => {
      expect(OPENAI.GPT_4).toBe('gpt-4');
    });

    it('should have GPT-3.5 Turbo constant', () => {
      expect(OPENAI.GPT_3_5_TURBO).toBe('gpt-3.5-turbo');
    });

    it('should have GPT-4o constant', () => {
      expect(OPENAI.GPT_4O).toBe('gpt-4o');
    });

    it('should have O1 constant', () => {
      expect(OPENAI.O1).toBe('o1');
    });
  });

  describe('ANTHROPIC namespace', () => {
    it('should have Claude 3.5 Sonnet constant', () => {
      expect(ANTHROPIC.CLAUDE_3_5_SONNET_20241022).toBe('claude-3-5-sonnet-20241022');
    });

    it('should have Claude 3.5 Haiku constant', () => {
      expect(ANTHROPIC.CLAUDE_3_5_HAIKU_20241022).toBe('claude-3-5-haiku-20241022');
    });

    it('should have Claude Sonnet 4.5 constant', () => {
      expect(ANTHROPIC.CLAUDE_SONNET_4_5).toBe('claude-sonnet-4-5');
    });
  });

  describe('GOOGLE namespace', () => {
    it('should have Gemini 2.5 Pro constant', () => {
      expect(GOOGLE.GEMINI_2_5_PRO).toBe('gemini-2.5-pro');
    });

    it('should have Gemini 1.5 Flash constant', () => {
      expect(GOOGLE.GEMINI_1_5_FLASH).toBe('gemini-1.5-flash');
    });

    it('should have Gemini Pro constant', () => {
      expect(GOOGLE.GEMINI_PRO).toBe('gemini-pro');
    });
  });

  describe('AWS_BEDROCK namespace', () => {
    it('should have Nova Pro constant', () => {
      expect(AWS_BEDROCK.NOVA_PRO).toBe('amazon.nova-pro-v1:0');
    });

    it('should have Claude 3.5 Sonnet Bedrock constant', () => {
      expect(AWS_BEDROCK.CLAUDE_3_5_SONNET_20241022).toBe(
        'anthropic.claude-3-5-sonnet-20241022-v1:0'
      );
    });
  });

  describe('XAI namespace', () => {
    it('should have Grok 2 constant', () => {
      expect(XAI.GROK_2_1212).toBe('grok-2-1212');
    });
  });

  describe('DEEPSEEK namespace', () => {
    it('should have DeepSeek Chat constant', () => {
      expect(DEEPSEEK.DEEPSEEK_CHAT).toBe('deepseek-chat');
    });
  });

  describe('MISTRAL namespace', () => {
    it('should have Mistral Large constant', () => {
      expect(MISTRAL.MISTRAL_LARGE_LATEST).toBe('mistral-large-latest');
    });
  });

  describe('COHERE namespace', () => {
    it('should have Command R Plus constant', () => {
      expect(COHERE.COMMAND_R_PLUS).toBe('command-r-plus');
    });
  });

  describe('GROQ namespace', () => {
    it('should have Llama 3.3 70B constant', () => {
      expect(GROQ.LLAMA_3_3_70B_VERSATILE).toBe('llama-3.3-70b-versatile');
    });
  });

  describe('META namespace', () => {
    it('should have Llama 3.3 70B Instruct constant', () => {
      expect(META.LLAMA_3_3_70B_INSTRUCT).toBe('llama-3.3-70b-instruct');
    });
  });

  describe('isModelConstant', () => {
    it('should return true for valid OpenAI model', () => {
      expect(isModelConstant(OPENAI.GPT_4)).toBe(true);
      expect(isModelConstant('gpt-4')).toBe(true);
    });

    it('should return true for valid Anthropic model', () => {
      expect(isModelConstant(ANTHROPIC.CLAUDE_3_5_SONNET_20241022)).toBe(true);
      expect(isModelConstant('claude-3-5-sonnet-20241022')).toBe(true);
    });

    it('should return true for valid Google model', () => {
      expect(isModelConstant(GOOGLE.GEMINI_2_5_PRO)).toBe(true);
      expect(isModelConstant('gemini-2.5-pro')).toBe(true);
    });

    it('should return false for invalid model', () => {
      expect(isModelConstant('invalid-model')).toBe(false);
      expect(isModelConstant('gpt-999')).toBe(false);
      expect(isModelConstant('')).toBe(false);
    });

    it('should return false for typos', () => {
      expect(isModelConstant('gpt4')).toBe(false); // Missing hyphen
      expect(isModelConstant('GPT-4')).toBe(false); // Wrong case
      expect(isModelConstant('gpt-4-turb')).toBe(false); // Typo
    });
  });

  describe('getAllModelConstants', () => {
    it('should return an array of all model constants', () => {
      const allModels = getAllModelConstants();
      expect(Array.isArray(allModels)).toBe(true);
      expect(allModels.length).toBeGreaterThan(0);
    });

    it('should include models from all providers', () => {
      const allModels = getAllModelConstants();
      expect(allModels).toContain('gpt-4');
      expect(allModels).toContain('claude-3-5-sonnet-20241022');
      expect(allModels).toContain('gemini-2.5-pro');
      expect(allModels).toContain('amazon.nova-pro-v1:0');
      expect(allModels).toContain('grok-2-1212');
      expect(allModels).toContain('deepseek-chat');
      expect(allModels).toContain('mistral-large-latest');
      expect(allModels).toContain('command-r-plus');
      expect(allModels).toContain('llama-3.3-70b-versatile');
      expect(allModels).toContain('llama-3.3-70b-instruct');
    });

    it('should not have duplicates', () => {
      const allModels = getAllModelConstants();
      const uniqueModels = [...new Set(allModels)];
      expect(allModels.length).toBe(uniqueModels.length);
    });
  });

  describe('getProviderFromModel', () => {
    it('should return OpenAI for OpenAI models', () => {
      expect(getProviderFromModel(OPENAI.GPT_4)).toBe('OpenAI');
      expect(getProviderFromModel(OPENAI.GPT_3_5_TURBO)).toBe('OpenAI');
      expect(getProviderFromModel('gpt-4o')).toBe('OpenAI');
    });

    it('should return Anthropic for Anthropic models', () => {
      expect(getProviderFromModel(ANTHROPIC.CLAUDE_3_5_SONNET_20241022)).toBe('Anthropic');
      expect(getProviderFromModel('claude-3-5-haiku-20241022')).toBe('Anthropic');
    });

    it('should return Google AI for Google models', () => {
      expect(getProviderFromModel(GOOGLE.GEMINI_2_5_PRO)).toBe('Google AI');
      expect(getProviderFromModel('gemini-1.5-flash')).toBe('Google AI');
    });

    it('should return AWS Bedrock for Bedrock models', () => {
      expect(getProviderFromModel(AWS_BEDROCK.NOVA_PRO)).toBe('AWS Bedrock');
      expect(getProviderFromModel('anthropic.claude-3-5-sonnet-20241022-v1:0')).toBe('AWS Bedrock');
    });

    it('should return xAI for xAI models', () => {
      expect(getProviderFromModel(XAI.GROK_2_1212)).toBe('xAI');
    });

    it('should return DeepSeek for DeepSeek models', () => {
      expect(getProviderFromModel(DEEPSEEK.DEEPSEEK_CHAT)).toBe('DeepSeek');
    });

    it('should return Mistral AI for Mistral models', () => {
      expect(getProviderFromModel(MISTRAL.MISTRAL_LARGE_LATEST)).toBe('Mistral AI');
    });

    it('should return Cohere for Cohere models', () => {
      expect(getProviderFromModel(COHERE.COMMAND_R_PLUS)).toBe('Cohere');
    });

    it('should return Grok for Grok models', () => {
      expect(getProviderFromModel(GROQ.LLAMA_3_3_70B_VERSATILE)).toBe('Grok');
    });

    it('should return Meta for Meta models', () => {
      expect(getProviderFromModel(META.LLAMA_3_3_70B_INSTRUCT)).toBe('Meta');
    });

    it('should return unknown for invalid models', () => {
      expect(getProviderFromModel('invalid-model')).toBe('unknown');
      expect(getProviderFromModel('')).toBe('unknown');
      expect(getProviderFromModel('gpt-999')).toBe('unknown');
    });
  });

  describe('Type Safety', () => {
    it('should export all namespace constants as strings', () => {
      expect(typeof OPENAI.GPT_4).toBe('string');
      expect(typeof ANTHROPIC.CLAUDE_3_5_SONNET_20241022).toBe('string');
      expect(typeof GOOGLE.GEMINI_2_5_PRO).toBe('string');
      expect(typeof AWS_BEDROCK.NOVA_PRO).toBe('string');
      expect(typeof XAI.GROK_2_1212).toBe('string');
      expect(typeof DEEPSEEK.DEEPSEEK_CHAT).toBe('string');
      expect(typeof MISTRAL.MISTRAL_LARGE_LATEST).toBe('string');
      expect(typeof COHERE.COMMAND_R_PLUS).toBe('string');
      expect(typeof GROQ.LLAMA_3_3_70B_VERSATILE).toBe('string');
      expect(typeof META.LLAMA_3_3_70B_INSTRUCT).toBe('string');
    });
  });

  describe('Backward Compatibility', () => {
    it('should accept string model names', () => {
      // These should all be valid model constants
      expect(isModelConstant('gpt-4')).toBe(true);
      expect(isModelConstant('claude-3-5-sonnet-20241022')).toBe(true);
      expect(isModelConstant('gemini-2.5-pro')).toBe(true);
    });

    it('should work with both constants and strings interchangeably', () => {
      const modelString = 'gpt-4';
      const modelConstant = OPENAI.GPT_4;

      expect(modelString).toBe(modelConstant);
      expect(isModelConstant(modelString)).toBe(true);
      expect(isModelConstant(modelConstant)).toBe(true);
      expect(getProviderFromModel(modelString)).toBe(getProviderFromModel(modelConstant));
    });
  });
});
