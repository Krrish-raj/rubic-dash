const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export interface Demographics {
  age: number;
  employment_type: string;
  dependents: number;
  health_status: string;
  risk_appetite: number;
  financial_maturity: number;
  market_outlook: string;
  location: string;
}

export interface Financials {
  monthly_expenses: number;
  savings_percentage: number;
  real_estate_value: number;
  is_housing_loan: boolean;
  real_estate_type: string;
  current_savings_and_investments: number;
  debts: number;
  business_value: number;
}

export interface GoalInput {
  timeline: number;
  goal: string;
  goal_id: string;
  goal_value: number;
  priority: number;
}

export interface GeneratePlanRequest {
  tag: string;
  name: string;
  demographics: Demographics;
  financials: Financials;
  goals_input: GoalInput[];
}

export interface GoalFundingRequirement {
  goal_id: string;
  goal_name: string;
  funding_amount: number;
  priority: number;
  timeline_months: number;
  target_amount: number;
}

export interface SavingsAllocation {
  goal_id: string;
  goal_name: string;
  amount: number;
  purpose: string;
  allocation_percentage: number;
}

export interface MonthlyActionPlan {
  goal_funding_requirements: GoalFundingRequirement[];
  trades: unknown[];
  total_goal_liquidation: number;
  goal_liquidation_tax_impact: number;
  savings_allocation: SavingsAllocation[];
  total_monthly_savings: number;
  remaining_savings: number;
  net_position_changes: unknown[];
  goal_status_updates: unknown[];
  portfolio_drift_percentage: number;
  monthly_liquidation_percentage: number;
  emergency_fund_ratio: number;
  portfolio_value_start: number;
  portfolio_value_end: number;
  fund_conservation_verified: boolean;
  constraints_satisfied: boolean;
  conservation_error: number;
  month: number;
  next_review_date: string;
  action_items: string[];
  warnings: string[];
  executive_summary: string;
  retirement_projection: {
    projected_corpus_available: number;
    corpus_needed: number;
    readiness_percentage: number;
    surplus_deficit: number;
  };
}

export interface AssetAllocation {
  name: string;
  position: {
    x: number;
    y: number;
  };
  riskiness: number;
  illiquidity: number;
  amount: number;
  currency: string;
  percentage: number;
  explanation: {
    description: string;
    risk: string;
    illiquidity: string;
  };
  assets: unknown[];
}

export interface RetirementProjection {
  readiness_percentage: number;
  target_corpus: number;
  current_corpus: number;
  monthly_contribution: number;
  years_to_retirement: number;
  surplus_deficit: number;
  retirement_age: number;
  age_at_calculation: number;
}

export interface GeneratePlanResponse {
  success: boolean;
  message: string;
  monthly_action_plan?: MonthlyActionPlan;
  asset_allocations: AssetAllocation[];
  retirement_projection?: RetirementProjection;
  emergency_fund?: number;
  goal_recommendations?: unknown;
  errors?: unknown;
  timestamp: string;
}

export async function generateFinancialPlan(request: GeneratePlanRequest): Promise<GeneratePlanResponse> {
  try {
    const response = await fetch(API_BASE_URL!, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating financial plan:', error);
    throw error;
  }
}

// Helper function to convert form data to API request format
export function convertFormDataToRequest(
  formData: Record<string, unknown>,
  goals: Array<Record<string, unknown>>,
  clientName: string,
  clientEmail: string,
  selectedProfile: string | null,
  profiles: Array<{ tag: string; name: string }>
): GeneratePlanRequest {
  // Generate unique goal IDs
  const goalsWithIds = goals.map((goal, index) => ({
    ...goal,
    goal_id: `goal_${index + 1}`,
  })) as Array<Record<string, unknown>>;

  // Determine tag and name based on selected profile
  let tag: string;
  let name: string;

  if (selectedProfile && selectedProfile !== 'custom') {
    // Use selected profile's tag and name
    const profile = profiles.find(p => p.tag === selectedProfile);
    tag = profile?.tag || 'fresh_start';
    name = profile?.name || `${clientName} - The Fresh Start`;
  } else {
    // Use custom profile with client name and email
    tag = 'custom';
    name = `${clientName} (${clientEmail}) - Custom Profile`;
  }

  return {
    tag,
    name,
    demographics: {
      age: Number(formData.age) || 0,
      employment_type: String(formData.employmentType) || '',
      dependents: Number(formData.dependents) || 0,
      health_status: String(formData.healthStatus) || '',
      risk_appetite: Number(formData.riskAppetite) || 0,
      financial_maturity: Number(formData.financialMaturity) || 0,
      market_outlook: String(formData.marketOutlook) || '',
      location: String(formData.location) || '',
    },
    financials: {
      monthly_expenses: Number(formData.monthlyExpenses) || 0,
      savings_percentage: Number(formData.savingsPercentage) || 0,
      real_estate_value: Number(formData.realEstateValue) || 0,
      is_housing_loan: Boolean(formData.isHousingLoan),
      real_estate_type: String(formData.realEstateType) || '',
      current_savings_and_investments: Number(formData.currentSavings) || 0,
      debts: Number(formData.debts) || 0,
      business_value: Number(formData.businessValue) || 0,
    },
    goals_input: goalsWithIds.map(goal => ({
      timeline: Number(goal.timeline) || 1,
      goal: String(goal.goal) || '',
      goal_id: String(goal.goal_id) || '',
      goal_value: Number(goal.goal_value) || 0,
      priority: Number(goal.priority) || 5,
    })),
  };
}
