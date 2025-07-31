/**
 * User Feedback & Value Tracking Types
 */

export interface FeedbackOptions {
    rating: boolean; // true = positive, false = negative
    comment?: string;
    implicitSignals?: ImplicitSignals;
}

export interface ImplicitSignals {
    copied?: boolean;
    conversationContinued?: boolean;
    immediateRephrase?: boolean;
    sessionDuration?: number; // in milliseconds
    codeAccepted?: boolean;
}

export interface FeedbackAnalytics {
    totalRequests: number;
    ratedRequests: number;
    positiveRatings: number;
    negativeRatings: number;
    totalCost: number;
    positiveCost: number;
    negativeCost: number;
    averageRating: number;
    costPerPositiveRating: number;
    costPerNegativeRating: number;
    ratingsByProvider: Record<string, ProviderRatings>;
    ratingsByModel: Record<string, ModelRatings>;
    ratingsByFeature: Record<string, FeatureRatings>;
    implicitSignalsAnalysis: ImplicitSignalsAnalysis;
    insights?: FeedbackInsights;
}

export interface ProviderRatings {
    positive: number;
    negative: number;
    cost: number;
}

export interface ModelRatings {
    positive: number;
    negative: number;
    cost: number;
}

export interface FeatureRatings {
    positive: number;
    negative: number;
    cost: number;
}

export interface ImplicitSignalsAnalysis {
    copyRate: number;
    continuationRate: number;
    rephraseRate: number;
    codeAcceptanceRate: number;
    averageSessionDuration: number;
}

export interface FeedbackInsights {
    wastedSpendPercentage: number;
    returnOnAISpend: number;
    costEfficiencyScore: number;
    recommendations: string[];
}

export interface FeedbackSubmissionResult {
    success: boolean;
    message: string;
    requestId?: string;
}

export interface FeedbackConfig {
    enableImplicitTracking?: boolean;
    trackCopyBehavior?: boolean;
    trackSessionDuration?: boolean;
    trackConversationFlow?: boolean;
}