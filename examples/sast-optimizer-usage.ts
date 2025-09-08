/**
 * SAST (Semantic Abstract Syntax Tree) Optimizer Usage Examples
 * Demonstrates direct usage of the SAST optimizer for semantic text processing
 */

import { SastOptimizer, SastOptimizationOptions } from '../src/optimizers/sast-optimizer';

async function basicSastOptimization() {
  console.log('=== Basic SAST Optimization ===');
  
  const sastOptimizer = new SastOptimizer();

  const text = "The quick brown fox jumps over the lazy dog and then runs through the forest to find food.";
  
  const result = await sastOptimizer.optimize(text, {
    language: 'en',
    disambiguationStrategy: 'hybrid',
    preserveAmbiguity: false,
    enableCrossLingual: false,
    maxPrimitives: 50,
    semanticThreshold: 0.7
  });

  console.log('Original Text:', result.originalText);
  console.log('Optimized Text:', result.optimizedText);
  console.log('Semantic Frame Type:', result.semanticFrame.frameType);
  console.log('Confidence:', result.semanticFrame.metadata.confidence);
  console.log('Processing Time:', result.semanticFrame.metadata.processingTime + 'ms');
  console.log('Token Reduction:', result.optimizationMetrics.tokenReduction.toFixed(2) + '%');
}

async function ambiguityResolution() {
  console.log('=== Ambiguity Resolution ===');
  
  const sastOptimizer = new SastOptimizer();

  // Text with potential ambiguities
  const ambiguousText = "I saw a man with a telescope. The bank is closed today. She can't bear the thought of leaving.";
  
  const result = await sastOptimizer.optimize(ambiguousText, {
    language: 'en',
    disambiguationStrategy: 'strict',
    preserveAmbiguity: true, // Keep ambiguities for analysis
    enableCrossLingual: false,
    maxPrimitives: 100,
    semanticThreshold: 0.8
  });

  console.log('Original Text:', result.originalText);
  console.log('Optimized Text:', result.optimizedText);
  console.log('Ambiguities Resolved:', result.ambiguitiesResolved.length);
  
  result.ambiguitiesResolved.forEach((ambiguity, index) => {
    console.log(`\nAmbiguity ${index + 1}:`);
    console.log(`  Span: [${ambiguity.ambiguousSpan[0]}, ${ambiguity.ambiguousSpan[1]}]`);
    console.log(`  Strategy: ${ambiguity.resolutionStrategy}`);
    console.log(`  Confidence: ${ambiguity.confidence}`);
    console.log(`  Chosen: ${ambiguity.chosenInterpretation.interpretation}`);
  });
}

async function crossLingualProcessing() {
  console.log('=== Cross-Lingual Semantic Processing ===');
  
  const sastOptimizer = new SastOptimizer();

  const englishText = "The artificial intelligence system processes natural language data efficiently.";
  
  const result = await sastOptimizer.optimize(englishText, {
    language: 'en',
    disambiguationStrategy: 'hybrid',
    preserveAmbiguity: false,
    enableCrossLingual: true, // Enable cross-lingual processing
    maxPrimitives: 75,
    semanticThreshold: 0.8
  });

  console.log('Original Text:', result.originalText);
  console.log('Optimized Text:', result.optimizedText);
  console.log('Cross-Lingual Equivalent:', result.crossLingualEquivalent);
  console.log('Universal Compatibility:', result.semanticFrame.metadata.universalCompatibility);
}

async function vocabularyExploration() {
  console.log('=== SAST Vocabulary Exploration ===');
  
  const sastOptimizer = new SastOptimizer();

  // Get vocabulary statistics
  const stats = sastOptimizer.getVocabularyStats();
  console.log('Vocabulary Statistics:');
  console.log(`  Total Primitives: ${stats.totalPrimitives}`);
  console.log(`  Categories:`, stats.primitivesByCategory);
  console.log(`  Language Coverage:`, stats.coverageByLanguage);
  console.log(`  Average Translations: ${stats.averageTranslations.toFixed(2)}`);
  console.log(`  Last Updated: ${stats.lastUpdated}`);

  // Search for specific primitives
  console.log('\n=== Semantic Primitive Search ===');
  
  const searchResults = sastOptimizer.searchPrimitives({
    term: 'intelligence',
    category: 'concept',
    language: 'en',
    limit: 5
  });

  console.log(`Found ${searchResults.totalFound} primitives for "intelligence":`);
  searchResults.results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.primitive.baseForm} (${result.primitive.category})`);
    console.log(`   Definition: ${result.primitive.definition}`);
    console.log(`   Synonyms: ${result.primitive.synonyms.join(', ')}`);
    console.log(`   Relevance Score: ${result.relevanceScore.toFixed(3)}`);
    console.log(`   Match Type: ${result.matchType}`);
  });

  // Search by category
  console.log('\n=== Category-based Search ===');
  
  const actionResults = sastOptimizer.searchPrimitives({
    category: 'action',
    limit: 3
  });

  console.log(`Found ${actionResults.totalFound} action primitives:`);
  actionResults.results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.primitive.baseForm}: ${result.primitive.definition}`);
  });
}

async function optimizationStrategies() {
  console.log('=== Different Optimization Strategies ===');
  
  const sastOptimizer = new SastOptimizer();
  const testText = "The machine learning algorithm processes large datasets to identify patterns and make predictions.";

  const strategies: Array<{ name: string; options: Partial<SastOptimizationOptions> }> = [
    {
      name: 'Strict Disambiguation',
      options: {
        disambiguationStrategy: 'strict',
        semanticThreshold: 0.9,
        maxPrimitives: 30
      }
    },
    {
      name: 'Permissive Disambiguation',
      options: {
        disambiguationStrategy: 'permissive',
        semanticThreshold: 0.5,
        maxPrimitives: 100
      }
    },
    {
      name: 'Hybrid Approach',
      options: {
        disambiguationStrategy: 'hybrid',
        semanticThreshold: 0.7,
        maxPrimitives: 50
      }
    }
  ];

  for (const strategy of strategies) {
    console.log(`\n=== ${strategy.name} ===`);
    
    const result = await sastOptimizer.optimize(testText, {
      language: 'en',
      preserveAmbiguity: false,
      enableCrossLingual: false,
      ...strategy.options
    });

    console.log(`Optimized Text: ${result.optimizedText}`);
    console.log(`Frame Type: ${result.semanticFrame.frameType}`);
    console.log(`Confidence: ${result.semanticFrame.metadata.confidence.toFixed(3)}`);
    console.log(`Token Reduction: ${result.optimizationMetrics.tokenReduction.toFixed(2)}%`);
    console.log(`Semantic Preservation: ${result.optimizationMetrics.semanticPreservation.toFixed(3)}`);
    console.log(`Ambiguity Reduction: ${result.optimizationMetrics.ambiguityReduction.toFixed(2)}%`);
  }
}

async function complexTextProcessing() {
  console.log('=== Complex Text Processing ===');
  
  const sastOptimizer = new SastOptimizer();

  const complexText = `
    Artificial intelligence and machine learning technologies have revolutionized 
    the way we approach data analysis and decision-making processes. These advanced 
    systems can process vast amounts of information, identify complex patterns, 
    and provide insights that would be impossible for humans to discover manually. 
    However, the implementation of such systems requires careful consideration of 
    ethical implications, data privacy concerns, and the potential for bias in 
    algorithmic decision-making.
  `;

  const result = await sastOptimizer.optimize(complexText, {
    language: 'en',
    disambiguationStrategy: 'hybrid',
    preserveAmbiguity: false,
    enableCrossLingual: true,
    maxPrimitives: 150,
    semanticThreshold: 0.8
  });

  console.log('Original Text Length:', complexText.length);
  console.log('Optimized Text Length:', result.optimizedText.length);
  console.log('Optimized Text:', result.optimizedText);
  console.log('\nSemantic Analysis:');
  console.log(`  Frame Type: ${result.semanticFrame.frameType}`);
  console.log(`  Syntactic Complexity: ${result.semanticFrame.metadata.syntacticComplexity.toFixed(2)}`);
  console.log(`  Semantic Depth: ${result.semanticFrame.metadata.semanticDepth.toFixed(2)}`);
  console.log(`  Universal Compatibility: ${result.semanticFrame.metadata.universalCompatibility}`);
  
  console.log('\nOptimization Metrics:');
  console.log(`  Token Reduction: ${result.optimizationMetrics.tokenReduction.toFixed(2)}%`);
  console.log(`  Semantic Preservation: ${result.optimizationMetrics.semanticPreservation.toFixed(3)}`);
  console.log(`  Ambiguity Reduction: ${result.optimizationMetrics.ambiguityReduction.toFixed(2)}%`);
  console.log(`  Cross-Lingual Compatibility: ${result.optimizationMetrics.crossLingualCompatibility}`);

  console.log('\nSource Mapping:');
  result.sourceMapping.primitives.forEach((primitive, index) => {
    console.log(`  ${index + 1}. ${primitive.primitiveId} (confidence: ${primitive.confidence.toFixed(3)})`);
    if (primitive.alternatives.length > 0) {
      console.log(`     Alternatives: ${primitive.alternatives.map(alt => alt.primitiveId).join(', ')}`);
    }
  });
}

async function performanceBenchmarking() {
  console.log('=== SAST Performance Benchmarking ===');
  
  const sastOptimizer = new SastOptimizer();

  const testTexts = [
    "Simple sentence with basic concepts.",
    "The artificial intelligence system processes natural language data efficiently and accurately.",
    "Machine learning algorithms analyze complex datasets to identify patterns, make predictions, and provide insights for decision-making processes in various industries including healthcare, finance, and technology.",
    "Advanced artificial intelligence and machine learning technologies have fundamentally transformed the landscape of data analysis, enabling organizations to process vast amounts of information, discover intricate patterns, and generate actionable insights that drive innovation and competitive advantage in today's rapidly evolving digital economy."
  ];

  const results: Array<{
    textLength: number;
    processingTime: number;
    tokenReduction: number;
    semanticPreservation: number;
    primitivesFound: number;
    ambiguitiesResolved: number;
  }> = [];

  for (let i = 0; i < testTexts.length; i++) {
    const text = testTexts[i];
    console.log(`\nProcessing text ${i + 1} (${text.length} characters)...`);
    
    const startTime = Date.now();
    const result = await sastOptimizer.optimize(text, {
      language: 'en',
      disambiguationStrategy: 'hybrid',
      preserveAmbiguity: false,
      enableCrossLingual: false,
      maxPrimitives: 100,
      semanticThreshold: 0.7
    });
    const processingTime = Date.now() - startTime;

    results.push({
      textLength: text.length,
      processingTime,
      tokenReduction: result.optimizationMetrics.tokenReduction,
      semanticPreservation: result.optimizationMetrics.semanticPreservation,
      primitivesFound: result.sourceMapping.primitives.length,
      ambiguitiesResolved: result.ambiguitiesResolved.length
    });

    console.log(`  Processing Time: ${processingTime}ms`);
    console.log(`  Token Reduction: ${result.optimizationMetrics.tokenReduction.toFixed(2)}%`);
    console.log(`  Primitives Found: ${result.sourceMapping.primitives.length}`);
  }

  console.log('\n=== Performance Summary ===');
  console.table(results);

  const avgProcessingTime = results.reduce((sum, r) => sum + r.processingTime, 0) / results.length;
  const avgTokenReduction = results.reduce((sum, r) => sum + r.tokenReduction, 0) / results.length;
  
  console.log(`Average Processing Time: ${avgProcessingTime.toFixed(2)}ms`);
  console.log(`Average Token Reduction: ${avgTokenReduction.toFixed(2)}%`);
}

async function integrationExample() {
  console.log('=== SAST Integration Example ===');
  
  const sastOptimizer = new SastOptimizer();

  // Simulate a real-world use case: optimizing user queries for better AI responses
  const userQueries = [
    "How do I implement a neural network for image classification?",
    "What are the best practices for data preprocessing in machine learning?",
    "Can you explain the difference between supervised and unsupervised learning?",
    "How can I optimize my machine learning model for better performance?"
  ];

  console.log('Optimizing user queries for better AI processing...\n');

  for (let i = 0; i < userQueries.length; i++) {
    const query = userQueries[i];
    console.log(`Query ${i + 1}: ${query}`);
    
    const result = await sastOptimizer.optimize(query, {
      language: 'en',
      disambiguationStrategy: 'hybrid',
      preserveAmbiguity: false,
      enableCrossLingual: false,
      maxPrimitives: 50,
      semanticThreshold: 0.8
    });

    console.log(`Optimized: ${result.optimizedText}`);
    console.log(`Semantic Frame: ${result.semanticFrame.frameType}`);
    console.log(`Key Primitives: ${result.sourceMapping.primitives.map(p => p.primitiveId).join(', ')}`);
    console.log(`Confidence: ${result.semanticFrame.metadata.confidence.toFixed(3)}\n`);
  }
}

// Run all SAST optimizer examples
async function runAllSastExamples() {
  try {
    await basicSastOptimization();
    await ambiguityResolution();
    await crossLingualProcessing();
    await vocabularyExploration();
    await optimizationStrategies();
    await complexTextProcessing();
    await performanceBenchmarking();
    await integrationExample();
    
    console.log('\n=== All SAST Optimizer Examples Completed Successfully! ===');
  } catch (error) {
    console.error('SAST example failed:', error);
  }
}

// Export for use in other files
export {
  basicSastOptimization,
  ambiguityResolution,
  crossLingualProcessing,
  vocabularyExploration,
  optimizationStrategies,
  complexTextProcessing,
  performanceBenchmarking,
  integrationExample,
  runAllSastExamples
};

// Run if this file is executed directly
if (require.main === module) {
  runAllSastExamples();
}
