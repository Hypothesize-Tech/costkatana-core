import { UsageMetadata, TrackingConfig } from '../types';

export class UsageTracker {
  private config: TrackingConfig;
  private storage: MemoryStorage;
  private cache: Map<string, UsageMetadata[]> = new Map();

  constructor(config: TrackingConfig) {
    this.config = config;
    this.storage = new MemoryStorage();
  }

  async track(metadata: UsageMetadata): Promise<void> {
    if (!this.config.enableAutoTracking) {
      return;
    }

    // Apply retention policy
    if (this.config.retentionDays) {
      await this.cleanOldData(this.config.retentionDays);
    }

    await this.storage.save(metadata);

    // Caching is no longer user-specific
    const allCache = this.cache.get('all_users') || [];
    allCache.push(metadata);
    this.cache.set('all_users', allCache);
  }

  async getUsageHistory(
    userId?: string,
    startDate?: Date,
    endDate?: Date,
    limit?: number
  ): Promise<UsageMetadata[]> {
    const filter = {
      userId,
      startDate,
      endDate,
      limit
    };

    return await this.storage.load(filter);
  }

  async getUserStats(userId: string): Promise<{
    totalRequests: number;
    totalCost: number;
    totalTokens: number;
    averageCostPerRequest: number;
    averageTokensPerRequest: number;
    lastUsed: Date | null;
  }> {
    const userHistory = await this.getUsageHistory(userId);

    if (userHistory.length === 0) {
      return {
        totalRequests: 0,
        totalCost: 0,
        totalTokens: 0,
        averageCostPerRequest: 0,
        averageTokensPerRequest: 0,
        lastUsed: null
      };
    }

    const totalRequests = userHistory.length;
    const totalCost = userHistory.reduce((sum, item) => sum + item.estimatedCost, 0);
    const totalTokens = userHistory.reduce((sum, item) => sum + item.totalTokens, 0);

    // lastUsed is no longer available from UsageMetadata
    return {
      totalRequests,
      totalCost,
      totalTokens,
      averageCostPerRequest: totalCost / totalRequests,
      averageTokensPerRequest: totalTokens / totalRequests,
      lastUsed: null
    };
  }

  async getModelStats(model: string): Promise<{
    totalRequests: number;
    totalCost: number;
    totalTokens: number;
    uniqueUsers: number;
    averageResponseTime: number;
  }> {
    const allHistory = await this.storage.load({});
    const modelHistory = allHistory.filter(item => item.model === model);

    if (modelHistory.length === 0) {
      return {
        totalRequests: 0,
        totalCost: 0,
        totalTokens: 0,
        uniqueUsers: 0,
        averageResponseTime: 0
      };
    }

    const uniqueUsers = 0; // Cannot determine unique users anymore
    const totalRequests = modelHistory.length;
    const totalCost = modelHistory.reduce((sum, item) => sum + item.estimatedCost, 0);
    const totalTokens = modelHistory.reduce((sum, item) => sum + item.totalTokens, 0);
    const totalResponseTime = modelHistory.reduce((sum, item) => sum + (item.responseTime || 0), 0);

    return {
      totalRequests,
      totalCost,
      totalTokens,
      uniqueUsers,
      averageResponseTime: totalResponseTime / totalRequests
    };
  }

  async exportData(format: 'json' | 'csv' = 'json'): Promise<string> {
    const allData = await this.storage.load({});

    if (format === 'json') {
      return JSON.stringify(allData, null, 2);
    } else {
      return this.convertToCSV(allData);
    }
  }

  private convertToCSV(data: UsageMetadata[]): string {
    if (data.length === 0) return '';

    const headers = [
      'provider',
      'model',
      'promptTokens',
      'completionTokens',
      'totalTokens',
      'estimatedCost',
      'responseTime',
      'sessionId'
    ];

    const rows = data.map(item => [
      item.provider,
      item.model,
      item.promptTokens,
      item.completionTokens,
      item.totalTokens,
      item.estimatedCost,
      item.responseTime || '',
      item.sessionId || ''
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  async cleanOldData(_retentionDays: number): Promise<void> {
    // This method is no longer possible without timestamps.
    // The storage implementation will need to handle its own retention.
    return Promise.resolve();
  }

  async clearCache(): Promise<void> {
    this.cache.clear();
  }
}

interface UsageFilter {
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

// Storage implementations
class MemoryStorage {
  private data: UsageMetadata[] = [];

  save(data: UsageMetadata): Promise<void> {
    this.data.push(data);
    return Promise.resolve();
  }

  load(filter: UsageFilter): Promise<UsageMetadata[]> {
    let result = [...this.data];

    // Filtering by userId, startDate, endDate is no longer possible here
    // as the data is not on the object. The custom storage would need to handle this.
    if (filter.limit) {
      result = result.slice(0, filter.limit);
    }

    return Promise.resolve(result);
  }

  clear(): Promise<void> {
    this.data = [];
    return Promise.resolve();
  }
}
