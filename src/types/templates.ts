/**
 * Template Types for Cost Katana SDK
 */

export interface TemplateVariable {
  name: string;
  description?: string;
  required?: boolean;
  defaultValue?: any;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description?: string;
  content: string;
  variables?: TemplateVariable[];
  category?: string;
  tags?: string[];
  version?: number;
  isPublic?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TemplateResolutionResult {
  prompt: string;
  template: TemplateDefinition;
  resolvedVariables: Record<string, any>;
  missingVariables?: string[];
}

export interface TemplateManagerConfig {
  apiKey?: string;
  baseUrl?: string;
  enableCaching?: boolean;
  cacheTTL?: number;
}

