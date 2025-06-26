import { UsageMetadata, TrackingConfig, CustomStorage } from '../types';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

export class UsageTracker {
  private config: TrackingConfig;
  private storage: UsageStorage;
  private cache: Map<string, UsageMetadata[]> = new Map();

  constructor(config: TrackingConfig) {
    this.config = config;
    this.storage = this.initializeStorage(config);
  }

  private initializeStorage(config: TrackingConfig): UsageStorage {
    switch (config.storageType) {
      case 'memory':
        return new MemoryStorage();
      case 'file':
        return new FileStorage();
      case 'custom':
        if (!config.customStorage) {
          throw new Error('Custom storage implementation required');
        }
        return new CustomStorageAdapter(config.customStorage);
      default:
        return new MemoryStorage();
    }
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

    // Update cache
    const userId = metadata.userId;
    const userCache = this.cache.get(userId) || [];
    userCache.push(metadata);
    this.cache.set(userId, userCache);
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

    const sortedHistory = [...userHistory].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );

    return {
      totalRequests,
      totalCost,
      totalTokens,
      averageCostPerRequest: totalCost / totalRequests,
      averageTokensPerRequest: totalTokens / totalRequests,
      lastUsed: sortedHistory[0].timestamp
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

    const uniqueUsers = new Set(modelHistory.map(item => item.userId)).size;
    const totalRequests = modelHistory.length;
    const totalCost = modelHistory.reduce((sum, item) => sum + item.estimatedCost, 0);
    const totalTokens = modelHistory.reduce((sum, item) => sum + item.totalTokens, 0);
    const totalResponseTime = modelHistory.reduce((sum, item) => sum + (item.duration || 0), 0);

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
      'userId',
      'timestamp',
      'provider',
      'model',
      'promptTokens',
      'completionTokens',
      'totalTokens',
      'estimatedCost',
      'duration',
      'sessionId'
    ];

    const rows = data.map(item => [
      item.userId,
      item.timestamp.toISOString(),
      item.provider,
      item.model,
      item.promptTokens,
      item.completionTokens,
      item.totalTokens,
      item.estimatedCost,
      item.duration || '',
      item.sessionId || ''
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  async cleanOldData(retentionDays: number): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const allData = await this.storage.load({});
    const filteredData = allData.filter(item => item.timestamp >= cutoffDate);

    await this.storage.clear();
    for (const item of filteredData) {
      await this.storage.save(item);
    }
  }

  clearCache(): void {
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
interface UsageStorage {
  save(data: UsageMetadata): Promise<void>;
  load(filter: UsageFilter): Promise<UsageMetadata[]>;
  clear(): Promise<void>;
}

class MemoryStorage implements UsageStorage {
  private data: UsageMetadata[] = [];

  save(data: UsageMetadata): Promise<void> {
    this.data.push(data);
    return Promise.resolve();
  }

  load(filter: UsageFilter): Promise<UsageMetadata[]> {
    let result = [...this.data];

    if (filter.userId) {
      result = result.filter(item => item.userId === filter.userId);
    }
    const { startDate, endDate } = filter;
    if (startDate) {
      result = result.filter(item => item.timestamp >= startDate);
    }
    if (endDate) {
      result = result.filter(item => item.timestamp <= endDate);
    }
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

class FileStorage implements UsageStorage {
  private filePath: string;

  constructor(filePath?: string) {
    this.filePath = filePath || join(process.cwd(), 'usage-data.json');
  }

  async save(data: UsageMetadata): Promise<void> {
    const allData = await this.load({});
    allData.push(data);
    writeFileSync(this.filePath, JSON.stringify(allData, null, 2));
  }

  load(filter: UsageFilter): Promise<UsageMetadata[]> {
    if (!existsSync(this.filePath)) {
      return Promise.resolve([]);
    }
    const fileContent = readFileSync(this.filePath, 'utf-8');
    const allData: UsageMetadata[] = JSON.parse(fileContent) as UsageMetadata[];

    let result = allData.map(item => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }));

    if (filter.userId) {
      result = result.filter(item => item.userId === filter.userId);
    }
    const { startDate: fileStartDate, endDate: fileEndDate } = filter;
    if (fileStartDate) {
      result = result.filter(item => item.timestamp >= fileStartDate);
    }
    if (fileEndDate) {
      result = result.filter(item => item.timestamp <= fileEndDate);
    }
    if (filter.limit) {
      result = result.slice(0, filter.limit);
    }

    return Promise.resolve(result);
  }

  async clear(): Promise<void> {
    if (existsSync(this.filePath)) {
      writeFileSync(this.filePath, '[]');
    }
    return Promise.resolve();
  }
}

class CustomStorageAdapter implements UsageStorage {
  constructor(private customStorage: CustomStorage) {}

  async save(data: UsageMetadata): Promise<void> {
    await this.customStorage.save(data);
  }

  async load(filter: UsageFilter): Promise<UsageMetadata[]> {
    return this.customStorage.load(filter);
  }

  async clear(): Promise<void> {
    await this.customStorage.clear();
  }
}
