import { CostEstimate, CustomPricing } from '../types';
import { ProviderModel, PricingUnit } from '../types/providers';

function toPricingUnit(unit: string): PricingUnit {
  switch (unit) {
    case 'per-token':
      return PricingUnit.PerToken;
    case 'per-1k-tokens':
      return PricingUnit.Per1KTokens;
    case 'per-1m-tokens':
      return PricingUnit.Per1MTokens;
    default:
      throw new Error(`Unknown pricing unit: ${unit}`);
  }
}

export function calculateCost(
  promptTokens: number,
  completionTokens: number,
  model: ProviderModel,
  customPricing?: CustomPricing
): CostEstimate {
  // Check for custom pricing first
  const custom = customPricing?.[model.id];
  const isCustom = !!custom;
  const pricing = isCustom ? custom : model.pricing;

  // Type guard for unit
  let unit: PricingUnit;
  if (isCustom) {
    unit = toPricingUnit(custom!.unit);
  } else {
    unit = (pricing as typeof model.pricing).unit;
  }

  // Convert tokens to pricing unit
  const promptUnits = convertTokensToUnit(promptTokens, unit);
  const completionUnits = convertTokensToUnit(completionTokens, unit);

  // Calculate costs
  const promptCost = isCustom
    ? promptUnits * custom!.promptPrice
    : promptUnits * (pricing as typeof model.pricing).prompt;
  const completionCost = isCustom
    ? completionUnits * custom!.completionPrice
    : completionUnits * (pricing as typeof model.pricing).completion;
  const totalCost = promptCost + completionCost;

  return {
    promptCost,
    completionCost,
    totalCost,
    currency: isCustom
      ? model.pricing.currency || 'USD'
      : (pricing as typeof model.pricing).currency,
    breakdown: {
      promptTokens,
      completionTokens,
      pricePerPromptToken: isCustom
        ? custom!.promptPrice / getUnitMultiplier(unit)
        : (pricing as typeof model.pricing).prompt / getUnitMultiplier(unit),
      pricePerCompletionToken: isCustom
        ? custom!.completionPrice / getUnitMultiplier(unit)
        : (pricing as typeof model.pricing).completion / getUnitMultiplier(unit)
    }
  };
}

function convertTokensToUnit(tokens: number, unit: PricingUnit): number {
  switch (unit) {
    case PricingUnit.PerToken:
      return tokens;
    case PricingUnit.Per1KTokens:
      return tokens / 1000;
    case PricingUnit.Per1MTokens:
      return tokens / 1000000;
    default:
      throw new Error(`Unknown pricing unit: ${unit}`);
  }
}

function getUnitMultiplier(unit: PricingUnit): number {
  switch (unit) {
    case PricingUnit.PerToken:
      return 1;
    case PricingUnit.Per1KTokens:
      return 1000;
    case PricingUnit.Per1MTokens:
      return 1000000;
    default:
      return 1;
  }
}

export function estimateMonthlyCost(
  dailyRequests: number,
  avgPromptTokens: number,
  avgCompletionTokens: number,
  model: ProviderModel,
  customPricing?: CustomPricing
): {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  breakdown: CostEstimate;
} {
  const singleRequestCost = calculateCost(
    avgPromptTokens,
    avgCompletionTokens,
    model,
    customPricing
  );

  const daily = singleRequestCost.totalCost * dailyRequests;
  const weekly = daily * 7;
  const monthly = daily * 30;
  const yearly = daily * 365;

  return {
    daily,
    weekly,
    monthly,
    yearly,
    breakdown: singleRequestCost
  };
}

export function compareCosts(
  promptTokens: number,
  completionTokens: number,
  models: ProviderModel[],
  customPricing?: CustomPricing
): Array<{
  model: string;
  provider: string;
  cost: CostEstimate;
  savingsVsHighest: number;
}> {
  const results = models.map(model => ({
    model: model.id,
    provider: model.provider,
    cost: calculateCost(promptTokens, completionTokens, model, customPricing)
  }));

  const highestCost = Math.max(...results.map(r => r.cost.totalCost));

  return results
    .map(result => ({
      ...result,
      savingsVsHighest: ((highestCost - result.cost.totalCost) / highestCost) * 100
    }))
    .sort((a, b) => a.cost.totalCost - b.cost.totalCost);
}

export function calculateROI(
  implementationCost: number,
  currentMonthlyCost: number,
  optimizedMonthlyCost: number,
  months: number = 12
): {
  monthlySavings: number;
  paybackPeriod: number;
  totalSavings: number;
  roi: number;
} {
  const monthlySavings = currentMonthlyCost - optimizedMonthlyCost;
  const paybackPeriod = implementationCost / monthlySavings;
  const totalSavings = monthlySavings * months - implementationCost;
  const roi = (totalSavings / implementationCost) * 100;

  return {
    monthlySavings,
    paybackPeriod,
    totalSavings,
    roi
  };
}

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(amount);
}

export function calculateBatchingEconomics(
  individualRequests: number,
  tokensPerRequest: number,
  batchSize: number,
  model: ProviderModel,
  overheadTokensPerBatch: number = 50
): {
  individualCost: number;
  batchedCost: number;
  savings: number;
  savingsPercentage: number;
} {
  const totalIndividualTokens = individualRequests * tokensPerRequest;
  const numberOfBatches = Math.ceil(individualRequests / batchSize);
  const batchedTokens = totalIndividualTokens + numberOfBatches * overheadTokensPerBatch;

  const individualCost = calculateCost(totalIndividualTokens, 0, model).totalCost;

  const batchedCost = calculateCost(batchedTokens, 0, model).totalCost;

  const savings = individualCost - batchedCost;
  const savingsPercentage = (savings / individualCost) * 100;

  return {
    individualCost,
    batchedCost,
    savings,
    savingsPercentage
  };
}
