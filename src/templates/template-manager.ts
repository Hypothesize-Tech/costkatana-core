/**
 * Template Manager for Cost Katana SDK
 * Handles local and backend template management
 */

import axios, { AxiosInstance } from 'axios';
import { TemplateDefinition, TemplateResolutionResult, TemplateManagerConfig } from '../types/templates';
import { logger } from '../logging/logger';

export class TemplateManager {
  private config: Required<TemplateManagerConfig>;
  private apiClient?: AxiosInstance;
  private localTemplates: Map<string, TemplateDefinition> = new Map();
  private templateCache: Map<string, { template: TemplateDefinition; expiry: number }> = new Map();

  constructor(config: TemplateManagerConfig = {}) {
    this.config = {
      apiKey: config.apiKey || process.env.COST_KATANA_API_KEY || process.env.API_KEY || '',
      baseUrl: config.baseUrl || 'https://cost-katana-backend.store',
      enableCaching: config.enableCaching ?? true,
      cacheTTL: config.cacheTTL ?? 300000, // 5 minutes
    };

    if (this.config.apiKey) {
      this.initializeApiClient();
    }
  }

  private initializeApiClient(): void {
    this.apiClient = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  /**
   * Define a local template
   */
  defineTemplate(template: TemplateDefinition): void {
    this.localTemplates.set(template.id, template);
    logger.debug('Template defined locally', { id: template.id, name: template.name });
  }

  /**
   * Get a template by ID (checks local first, then backend)
   */
  async getTemplate(templateId: string): Promise<TemplateDefinition | null> {
    // Check local templates first
    const localTemplate = this.localTemplates.get(templateId);
    if (localTemplate) {
      logger.debug('Template found locally', { id: templateId });
      return localTemplate;
    }

    // Check cache
    if (this.config.enableCaching) {
      const cached = this.templateCache.get(templateId);
      if (cached && cached.expiry > Date.now()) {
        logger.debug('Template found in cache', { id: templateId });
        return cached.template;
      }
    }

    // Fetch from backend
    return this.fetchTemplate(templateId);
  }

  /**
   * Fetch template from backend
   */
  async fetchTemplate(templateId: string): Promise<TemplateDefinition | null> {
    if (!this.apiClient) {
      logger.warn('No API client configured. Cannot fetch templates from backend.');
      return null;
    }

    try {
      const response = await this.apiClient.get(`/api/prompt-templates/${templateId}`);
      const template: TemplateDefinition = response.data.data;

      // Cache the template
      if (this.config.enableCaching) {
        this.templateCache.set(templateId, {
          template,
          expiry: Date.now() + this.config.cacheTTL,
        });
      }

      logger.debug('Template fetched from backend', { id: templateId, name: template.name });
      return template;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          logger.warn('Template not found', { id: templateId });
        } else {
          logger.error('Failed to fetch template', error);
        }
      }
      return null;
    }
  }

  /**
   * List all available templates (local + backend)
   */
  async listTemplates(): Promise<TemplateDefinition[]> {
    const templates: TemplateDefinition[] = Array.from(this.localTemplates.values());

    if (this.apiClient) {
      try {
        const response = await this.apiClient.get('/api/prompt-templates');
        const backendTemplates: TemplateDefinition[] = response.data.data || [];
        
        // Filter out duplicates (local takes precedence)
        const uniqueBackendTemplates = backendTemplates.filter(
          (bt) => !this.localTemplates.has(bt.id)
        );
        
        templates.push(...uniqueBackendTemplates);
        logger.debug('Templates listed', { 
          local: this.localTemplates.size, 
          backend: uniqueBackendTemplates.length 
        });
      } catch (error) {
        logger.error('Failed to list backend templates', error instanceof Error ? error : new Error(String(error)));
      }
    }

    return templates;
  }

  /**
   * Resolve template with variables
   */
  async resolveTemplate(
    templateId: string,
    variables: Record<string, any> = {}
  ): Promise<TemplateResolutionResult> {
    const template = await this.getTemplate(templateId);

    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // Find all variables in the template content
    const variablePattern = /\{\{(\w+)\}\}/g;
    const foundVariables = new Set<string>();
    let match;

    while ((match = variablePattern.exec(template.content)) !== null) {
      foundVariables.add(match[1]);
    }

    // Check for missing required variables
    const requiredVariables = template.variables?.filter((v) => v.required).map((v) => v.name) || [];
    const missingVariables = requiredVariables.filter(
      (name) => !(name in variables) && !template.variables?.find((v) => v.name === name)?.defaultValue
    );

    if (missingVariables.length > 0) {
      throw new Error(`Missing required variables: ${missingVariables.join(', ')}`);
    }

    // Resolve variables with defaults
    const resolvedVariables: Record<string, any> = {};
    foundVariables.forEach((varName) => {
      if (varName in variables) {
        resolvedVariables[varName] = variables[varName];
      } else {
        const varDef = template.variables?.find((v) => v.name === varName);
        if (varDef?.defaultValue !== undefined) {
          resolvedVariables[varName] = varDef.defaultValue;
        } else {
          resolvedVariables[varName] = `{{${varName}}}`; // Keep placeholder if no value
        }
      }
    });

    // Substitute variables in content
    let prompt = template.content;
    Object.entries(resolvedVariables).forEach(([key, value]) => {
      const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      prompt = prompt.replace(placeholder, String(value));
    });

    logger.debug('Template resolved', {
      id: templateId,
      name: template.name,
      variableCount: Object.keys(resolvedVariables).length,
    });

    // Track usage if backend available
    if (this.apiClient) {
      this.trackTemplateUsage(templateId, resolvedVariables).catch((err) => {
        logger.debug('Failed to track template usage', err);
      });
    }

    return {
      prompt,
      template,
      resolvedVariables,
      missingVariables: missingVariables.length > 0 ? missingVariables : undefined,
    };
  }

  /**
   * Track template usage on backend
   */
  private async trackTemplateUsage(templateId: string, variables: Record<string, any>): Promise<void> {
    if (!this.apiClient) return;

    try {
      await this.apiClient.post(`/api/prompt-templates/${templateId}/use`, {
        variables,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // Silent fail - tracking is not critical
      logger.debug('Template usage tracking failed', error);
    }
  }

  /**
   * Clear template cache
   */
  clearCache(): void {
    this.templateCache.clear();
    logger.debug('Template cache cleared');
  }

  /**
   * Remove a local template
   */
  removeLocalTemplate(templateId: string): boolean {
    const result = this.localTemplates.delete(templateId);
    if (result) {
      logger.debug('Local template removed', { id: templateId });
    }
    return result;
  }

  /**
   * Get number of local templates
   */
  getLocalTemplateCount(): number {
    return this.localTemplates.size;
  }
}

// Export singleton instance
export const templateManager = new TemplateManager();

