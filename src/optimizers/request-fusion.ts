import { OptimizationSuggestion, AIProvider } from '../types';
import { TokenCounter } from '../analyzers/token-counter';
import { v4 as uuidv4 } from 'uuid';

export interface FusionRequest {
    id: string;
    prompt: string;
    timestamp: number;
    model: string;
    provider: AIProvider;
    metadata?: Record<string, any>;
}

export class RequestFusion {
    private requestQueue: FusionRequest[] = [];
    private fusionWindow: number = 5000; // 5 seconds
    private maxBatchSize: number = 5;

    constructor(fusionWindow?: number, maxBatchSize?: number) {
        if (fusionWindow) this.fusionWindow = fusionWindow;
        if (maxBatchSize) this.maxBatchSize = maxBatchSize;
    }

    async analyzeRequestsForFusion(
        requests: FusionRequest[]
    ): Promise<OptimizationSuggestion[]> {
        const suggestions: OptimizationSuggestion[] = [];

        // Group requests by time window
        const timeGroups = this.groupRequestsByTimeWindow(requests);

        for (const group of timeGroups) {
            if (group.length < 2) continue;

            // Analyze different fusion strategies
            const sequentialFusion = await this.analyzeSequentialFusion(group);
            if (sequentialFusion) suggestions.push(sequentialFusion);

            const parallelFusion = await this.analyzeParallelFusion(group);
            if (parallelFusion) suggestions.push(parallelFusion);

            const hierarchicalFusion = await this.analyzeHierarchicalFusion(group);
            if (hierarchicalFusion) suggestions.push(hierarchicalFusion);
        }

        return suggestions.sort((a, b) => b.estimatedSavings - a.estimatedSavings);
    }

    private groupRequestsByTimeWindow(requests: FusionRequest[]): FusionRequest[][] {
        const groups: FusionRequest[][] = [];
        let currentGroup: FusionRequest[] = [];

        const sortedRequests = [...requests].sort((a, b) => a.timestamp - b.timestamp);

        for (const request of sortedRequests) {
            if (currentGroup.length === 0) {
                currentGroup.push(request);
            } else {
                const timeDiff = request.timestamp - currentGroup[currentGroup.length - 1].timestamp;
                if (timeDiff <= this.fusionWindow && currentGroup.length < this.maxBatchSize) {
                    currentGroup.push(request);
                } else {
                    groups.push(currentGroup);
                    currentGroup = [request];
                }
            }
        }

        if (currentGroup.length > 0) {
            groups.push(currentGroup);
        }

        return groups;
    }

    private async analyzeSequentialFusion(
        requests: FusionRequest[]
    ): Promise<OptimizationSuggestion | null> {
        // Check if requests form a logical sequence
        const isSequential = this.detectSequentialPattern(requests);
        if (!isSequential) return null;

        const fusedPrompt = this.createSequentialFusedPrompt(requests);
        const totalOriginalTokens = await this.calculateTotalTokens(requests);
        const fusedTokens = await TokenCounter.countTokens(
            fusedPrompt,
            requests[0].provider,
            requests[0].model
        );

        const savings = ((totalOriginalTokens - fusedTokens) / totalOriginalTokens) * 100;
        if (savings < 15) return null;

        return {
            id: uuidv4(),
            type: 'request_fusion',
            originalPrompt: requests.map(r => r.prompt).join('\n\n---\n\n'),
            optimizedPrompt: fusedPrompt,
            estimatedSavings: savings,
            confidence: 0.85,
            explanation: `Fused ${requests.length} sequential requests into a single comprehensive prompt`,
            implementation: 'Sequential request fusion with numbered steps',
            fusionDetails: {
                fusedRequests: requests.map(r => r.id),
                fusionStrategy: 'sequential',
                estimatedTimeReduction: (requests.length - 1) * 1000 // Approximate API call overhead
            }
        };
    }

    private detectSequentialPattern(requests: FusionRequest[]): boolean {
        // Look for patterns indicating sequential processing
        const sequentialKeywords = ['then', 'next', 'after', 'step', 'first', 'second', 'finally'];
        const prompts = requests.map(r => r.prompt.toLowerCase());

        let sequentialCount = 0;
        for (const prompt of prompts) {
            if (sequentialKeywords.some(keyword => prompt.includes(keyword))) {
                sequentialCount++;
            }
        }

        // Also check for numbered lists or similar patterns
        const hasNumbering = prompts.some(p => /^\d+[\.\)]\s/.test(p) || /step\s+\d+/i.test(p));

        return sequentialCount >= requests.length / 2 || hasNumbering;
    }

    private createSequentialFusedPrompt(requests: FusionRequest[]): string {
        const intro = "Please complete the following tasks in order:\n\n";
        const tasks = requests.map((r, i) => `${i + 1}. ${r.prompt.trim()}`).join('\n\n');
        const outro = "\n\nProvide the results for each task clearly labeled with its number.";

        return intro + tasks + outro;
    }

    private async analyzeParallelFusion(
        requests: FusionRequest[]
    ): Promise<OptimizationSuggestion | null> {
        // Check if requests can be processed in parallel
        const isParallel = this.detectParallelPattern(requests);
        if (!isParallel) return null;

        const fusedPrompt = this.createParallelFusedPrompt(requests);
        const totalOriginalTokens = await this.calculateTotalTokens(requests);
        const fusedTokens = await TokenCounter.countTokens(
            fusedPrompt,
            requests[0].provider,
            requests[0].model
        );

        const savings = ((totalOriginalTokens - fusedTokens) / totalOriginalTokens) * 100;
        if (savings < 15) return null;

        return {
            id: uuidv4(),
            type: 'request_fusion',
            originalPrompt: requests.map(r => r.prompt).join('\n\n---\n\n'),
            optimizedPrompt: fusedPrompt,
            estimatedSavings: savings,
            confidence: 0.8,
            explanation: `Fused ${requests.length} independent requests for parallel processing`,
            implementation: 'Parallel request fusion with separate sections',
            fusionDetails: {
                fusedRequests: requests.map(r => r.id),
                fusionStrategy: 'parallel',
                estimatedTimeReduction: (requests.length - 1) * 1500 // Higher savings for parallel
            }
        };
    }

    private detectParallelPattern(requests: FusionRequest[]): boolean {
        // Check if requests are independent and can be processed in parallel
        const prompts = requests.map(r => r.prompt.toLowerCase());

        // Look for similar structure or independent questions
        const hasQuestions = prompts.filter(p => p.includes('?')).length >= requests.length * 0.7;
        const hasListRequests = prompts.filter(p =>
            p.includes('list') || p.includes('enumerate') || p.includes('provide')
        ).length >= requests.length * 0.6;

        // Check for no sequential dependencies
        const sequentialKeywords = ['then', 'after that', 'based on the above', 'using the previous'];
        const hasSequentialDeps = prompts.some(p =>
            sequentialKeywords.some(keyword => p.includes(keyword))
        );

        return (hasQuestions || hasListRequests) && !hasSequentialDeps;
    }

    private createParallelFusedPrompt(requests: FusionRequest[]): string {
        const intro = "Please answer the following independent questions:\n\n";
        const questions = requests.map((r, i) =>
            `Question ${i + 1}:\n${r.prompt.trim()}`
        ).join('\n\n');
        const outro = "\n\nProvide each answer in a clearly labeled section.";

        return intro + questions + outro;
    }

    private async analyzeHierarchicalFusion(
        requests: FusionRequest[]
    ): Promise<OptimizationSuggestion | null> {
        // Check for hierarchical relationships
        const hierarchy = this.detectHierarchicalPattern(requests);
        if (!hierarchy) return null;

        const fusedPrompt = this.createHierarchicalFusedPrompt(requests, hierarchy);
        const totalOriginalTokens = await this.calculateTotalTokens(requests);
        const fusedTokens = await TokenCounter.countTokens(
            fusedPrompt,
            requests[0].provider,
            requests[0].model
        );

        const savings = ((totalOriginalTokens - fusedTokens) / totalOriginalTokens) * 100;
        if (savings < 20) return null;

        return {
            id: uuidv4(),
            type: 'request_fusion',
            originalPrompt: requests.map(r => r.prompt).join('\n\n---\n\n'),
            optimizedPrompt: fusedPrompt,
            estimatedSavings: savings,
            confidence: 0.75,
            explanation: `Fused ${requests.length} requests with hierarchical structure`,
            implementation: 'Hierarchical request fusion with main topic and subtopics',
            fusionDetails: {
                fusedRequests: requests.map(r => r.id),
                fusionStrategy: 'hierarchical',
                estimatedTimeReduction: (requests.length - 1) * 1200
            }
        };
    }

    private detectHierarchicalPattern(requests: FusionRequest[]): {
        main: number;
        subtopics: number[];
    } | null {
        const prompts = requests.map(r => r.prompt);

        // Find potential main topic (usually broader, more general)
        let mainIndex = -1;
        let maxGenerality = -1;

        for (let i = 0; i < prompts.length; i++) {
            const generality = this.calculateGenerality(prompts[i]);
            if (generality > maxGenerality) {
                maxGenerality = generality;
                mainIndex = i;
            }
        }

        if (mainIndex === -1) return null;

        // Check if other prompts are related subtopics
        const mainPrompt = prompts[mainIndex].toLowerCase();
        const subtopics: number[] = [];

        for (let i = 0; i < prompts.length; i++) {
            if (i !== mainIndex) {
                const prompt = prompts[i].toLowerCase();
                if (this.areRelated(mainPrompt, prompt)) {
                    subtopics.push(i);
                }
            }
        }

        if (subtopics.length < requests.length * 0.5) return null;

        return { main: mainIndex, subtopics };
    }

    private calculateGenerality(prompt: string): number {
        // Simple heuristic: shorter, broader terms indicate more general topics
        const generalTerms = ['explain', 'describe', 'what is', 'overview', 'summary', 'introduction'];
        let score = 100 / prompt.length; // Shorter = more general

        for (const term of generalTerms) {
            if (prompt.toLowerCase().includes(term)) {
                score += 10;
            }
        }

        return score;
    }

    private areRelated(mainPrompt: string, subPrompt: string): boolean {
        // Extract key terms from main prompt
        const mainTerms = this.extractKeyTerms(mainPrompt);
        const subTerms = this.extractKeyTerms(subPrompt);

        // Check for overlap
        const overlap = mainTerms.filter(term => subTerms.includes(term)).length;
        return overlap >= Math.min(mainTerms.length, subTerms.length) * 0.3;
    }

    private extractKeyTerms(text: string): string[] {
        // Simple term extraction (in production, use NLP libraries)
        const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once']);

        return text.toLowerCase()
            .split(/\W+/)
            .filter(word => word.length > 3 && !stopWords.has(word));
    }

    private createHierarchicalFusedPrompt(
        requests: FusionRequest[],
        hierarchy: { main: number; subtopics: number[] }
    ): string {
        const mainPrompt = requests[hierarchy.main].prompt;
        const subtopicPrompts = hierarchy.subtopics.map(i => requests[i].prompt);

        let fusedPrompt = `Main Topic: ${mainPrompt}\n\n`;
        fusedPrompt += "Please address the main topic and the following related subtopics:\n\n";

        subtopicPrompts.forEach((prompt, i) => {
            fusedPrompt += `${i + 1}. ${prompt}\n`;
        });

        fusedPrompt += "\nProvide a comprehensive response that covers the main topic and integrates information about each subtopic.";

        return fusedPrompt;
    }

    private async calculateTotalTokens(requests: FusionRequest[]): Promise<number> {
        let total = 0;
        for (const request of requests) {
            total += await TokenCounter.countTokens(
                request.prompt,
                request.provider,
                request.model
            );
        }
        return total;
    }

    // Queue management for real-time fusion
    async queueRequest(request: FusionRequest): Promise<void> {
        this.requestQueue.push(request);

        // Clean old requests
        const now = Date.now();
        this.requestQueue = this.requestQueue.filter(
            r => now - r.timestamp <= this.fusionWindow
        );
    }

    async getQueuedRequests(): Promise<FusionRequest[]> {
        const now = Date.now();
        return this.requestQueue.filter(
            r => now - r.timestamp <= this.fusionWindow
        );
    }

    clearQueue(): void {
        this.requestQueue = [];
    }
} 