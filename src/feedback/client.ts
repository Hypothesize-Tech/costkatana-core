import axios, { AxiosInstance } from 'axios';
import {
  FeedbackOptions,
  FeedbackAnalytics,
  FeedbackSubmissionResult,
  ImplicitSignals
} from '../types/feedback';

export class FeedbackClient {
  private client: AxiosInstance;
  private baseURL: string;
  private apiKey: string;

  constructor(apiKey: string, baseURL: string = 'https://cost-katana-backend.store/api') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Submit feedback for a specific request
   */
  async submitFeedback(
    requestId: string,
    feedback: FeedbackOptions
  ): Promise<FeedbackSubmissionResult> {
    try {
      const response = await this.client.post(`/v1/request/${requestId}/feedback`, feedback);

      return {
        success: true,
        message: response.data.message || 'Feedback submitted successfully',
        requestId
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to submit feedback',
        requestId
      };
    }
  }

  /**
   * Update implicit signals for a request
   */
  async updateImplicitSignals(
    requestId: string,
    signals: ImplicitSignals
  ): Promise<FeedbackSubmissionResult> {
    try {
      const response = await this.client.put(`/v1/request/${requestId}/implicit-signals`, signals);

      return {
        success: true,
        message: response.data.message || 'Implicit signals updated successfully',
        requestId
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to update implicit signals',
        requestId
      };
    }
  }

  /**
   * Get feedback for a specific request
   */
  async getFeedback(requestId: string): Promise<any> {
    try {
      const response = await this.client.get(`/v1/request/${requestId}/feedback`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // No feedback found
      }
      throw error;
    }
  }

  /**
   * Get user feedback analytics (Return on AI Spend)
   */
  async getFeedbackAnalytics(): Promise<FeedbackAnalytics> {
    try {
      const response = await this.client.get('/v1/feedback/analytics');
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        `Failed to get feedback analytics: ${error.response?.data?.error || error.message}`
      );
    }
  }

  /**
   * Get enhanced feedback analytics with insights
   */
  async getEnhancedFeedbackAnalytics(): Promise<FeedbackAnalytics> {
    try {
      const response = await this.client.get('/analytics/feedback');
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        `Failed to get enhanced feedback analytics: ${error.response?.data?.error || error.message}`
      );
    }
  }

  /**
   * Get global feedback analytics (admin only)
   */
  async getGlobalFeedbackAnalytics(): Promise<FeedbackAnalytics> {
    try {
      const response = await this.client.get('/v1/feedback/analytics/global');
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        `Failed to get global feedback analytics: ${error.response?.data?.error || error.message}`
      );
    }
  }
}
