'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Card from '@/components/Card';
import ProfileCard from '@/components/ProfileCard';
import ConfirmationModal from '@/components/ConfirmationModal';
import profilesData from '@/constants/constants.json';
import { generateFinancialPlan, convertFormDataToRequest } from '@/utils/api';

interface Profile {
  tag: string;
  name: string;
  demographics: {
    age: number;
    employment_type: string;
    dependents: number;
    health_status: string;
    risk_appetite: number;
    financial_maturity: number;
    market_outlook: string;
    location: string;
  };
  financials: {
    monthly_expenses: number;
    savings_percentage: number;
    real_estate_value: number;
    is_housing_loan: boolean;
    real_estate_type: string;
    current_savings_and_investments: number;
    debts: number;
    business_value: number;
  };
}

interface UserData {
  email?: string;
  id: string;
}

interface Goal {
  timeline: number;
  goal: string;
  goal_value: number;
  priority: number;
}

interface ProfileFormData {
  age: number;
  employmentType: string;
  dependents: number;
  healthStatus: string;
  riskAppetite: number;
  financialMaturity: number;
  marketOutlook: string;
  location: string;
  monthlyExpenses: number;
  savingsPercentage: number;
  realEstateValue: number;
  isHousingLoan: boolean;
  realEstateType: string;
  currentSavings: number;
  debts: number;
  businessValue: number;
}

const initialFormData: ProfileFormData = {
  age: 0,
  employmentType: '',
  dependents: 0,
  healthStatus: '',
  riskAppetite: 0,
  financialMaturity: 0,
  marketOutlook: '',
  location: '',
  monthlyExpenses: 0,
  savingsPercentage: 0,
  realEstateValue: 0,
  isHousingLoan: false,
  realEstateType: '',
  currentSavings: 0,
  debts: 0,
  businessValue: 0,
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  const [showModal, setShowModal] = useState(false);
  const [pendingProfile, setPendingProfile] = useState<Profile | null>(null);
  
  // Client details for advisor
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  
  // Goals
  const [goals, setGoals] = useState<Goal[]>([]);
  
  // API state
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load profiles data
  const profiles: Profile[] = profilesData.data;

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        router.push('/login');
      } else {
        setUser(user);
        
        // Set first profile as default
        if (profiles.length > 0) {
          const defaultProfile = profiles[0];
          setSelectedProfile(defaultProfile.tag);
          setFormData({
            age: defaultProfile.demographics.age,
            employmentType: defaultProfile.demographics.employment_type,
            dependents: defaultProfile.demographics.dependents,
            healthStatus: defaultProfile.demographics.health_status,
            riskAppetite: defaultProfile.demographics.risk_appetite,
            financialMaturity: defaultProfile.demographics.financial_maturity,
            marketOutlook: defaultProfile.demographics.market_outlook,
            location: defaultProfile.demographics.location,
            monthlyExpenses: defaultProfile.financials.monthly_expenses,
            savingsPercentage: defaultProfile.financials.savings_percentage,
            realEstateValue: defaultProfile.financials.real_estate_value,
            isHousingLoan: defaultProfile.financials.is_housing_loan,
            realEstateType: defaultProfile.financials.real_estate_type,
            currentSavings: defaultProfile.financials.current_savings_and_investments,
            debts: defaultProfile.financials.debts,
            businessValue: defaultProfile.financials.business_value,
          });
        }
      }
      setLoading(false);
    };

    checkUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleFormChange = (field: keyof ProfileFormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addGoal = () => {
    setGoals([...goals, { timeline: 1, goal: '', goal_value: 0, priority: 5 }]);
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const updateGoal = (index: number, field: keyof Goal, value: string | number) => {
    const newGoals = [...goals];
    newGoals[index] = { ...newGoals[index], [field]: value };
    setGoals(newGoals);
  };


  const isClientInfoValid = () => {
    return clientName.trim() !== '' && clientEmail.trim() !== '';
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const hasFormData = () => {
    // Check if any form field has been filled
    return Object.values(formData).some((value) => {
      if (typeof value === 'boolean') return false; // Ignore boolean fields
      if (typeof value === 'number') return value > 0;
      if (typeof value === 'string') return value !== '';
      return false;
    });
  };

  const handleProfileClick = (profile: Profile | null) => {
    if (profile === null) {
      // None selected - reset form
      setSelectedProfile(null);
      setFormData(initialFormData);
    } else {
      // Only show modal if switching from None and form has data, or switching between profiles
      if (selectedProfile === null && hasFormData()) {
        // Switching from None with data - show modal
        setPendingProfile(profile);
        setShowModal(true);
      } else if (selectedProfile !== null && selectedProfile !== profile.tag) {
        // Switching between profiles - show modal
        setPendingProfile(profile);
        setShowModal(true);
      } else if (selectedProfile === null && !hasFormData()) {
        // Switching from None without data - no modal needed
        setSelectedProfile(profile.tag);
        setFormData({
          age: profile.demographics.age,
          employmentType: profile.demographics.employment_type,
          dependents: profile.demographics.dependents,
          healthStatus: profile.demographics.health_status,
          riskAppetite: profile.demographics.risk_appetite,
          financialMaturity: profile.demographics.financial_maturity,
          marketOutlook: profile.demographics.market_outlook,
          location: profile.demographics.location,
          monthlyExpenses: profile.financials.monthly_expenses,
          savingsPercentage: profile.financials.savings_percentage,
          realEstateValue: profile.financials.real_estate_value,
          isHousingLoan: profile.financials.is_housing_loan,
          realEstateType: profile.financials.real_estate_type,
          currentSavings: profile.financials.current_savings_and_investments,
          debts: profile.financials.debts,
          businessValue: profile.financials.business_value,
        });
      }
    }
  };

  const handleConfirmProfileChange = () => {
    if (pendingProfile) {
      setSelectedProfile(pendingProfile.tag);
      // Populate form with profile data
      setFormData({
        age: pendingProfile.demographics.age,
        employmentType: pendingProfile.demographics.employment_type,
        dependents: pendingProfile.demographics.dependents,
        healthStatus: pendingProfile.demographics.health_status,
        riskAppetite: pendingProfile.demographics.risk_appetite,
        financialMaturity: pendingProfile.demographics.financial_maturity,
        marketOutlook: pendingProfile.demographics.market_outlook,
        location: pendingProfile.demographics.location,
        monthlyExpenses: pendingProfile.financials.monthly_expenses,
        savingsPercentage: pendingProfile.financials.savings_percentage,
        realEstateValue: pendingProfile.financials.real_estate_value,
        isHousingLoan: pendingProfile.financials.is_housing_loan,
        realEstateType: pendingProfile.financials.real_estate_type,
        currentSavings: pendingProfile.financials.current_savings_and_investments,
        debts: pendingProfile.financials.debts,
        businessValue: pendingProfile.financials.business_value,
      });
    }
    setShowModal(false);
    setPendingProfile(null);
  };


  const handleGeneratePlan = async () => {
    if (!isClientInfoValid()) {
      setError('Please enter client name and email');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const request = convertFormDataToRequest(
        formData as unknown as Record<string, unknown>, 
        goals as unknown as Array<Record<string, unknown>>, 
        clientName,
        clientEmail,
        selectedProfile,
        profiles.map(p => ({ tag: p.tag, name: p.name }))
      );
      const response = await generateFinancialPlan(request);
      
      // Store the response in sessionStorage
      const clientInfo = {
        name: clientName,
        email: clientEmail,
      };
      
      // Store data in sessionStorage to avoid URL length issues
      sessionStorage.setItem('generatedPlan', JSON.stringify(response));
      sessionStorage.setItem('clientInfo', JSON.stringify(clientInfo));
      
      // Auto-redirect to results page
      window.location.href = '/results?generated=true';
    } catch (err) {
      console.error('Error generating plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate plan');
    } finally {
      setIsGenerating(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userEmail = user.email || 'No email';
  const userName = userEmail.split('@')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-blue-200">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-blue-50 to-indigo-50 
                    shadow-lg border-b-2 border-blue-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 
                           bg-clip-text text-transparent">
                Personal Finance
              </h1>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 text-sm font-medium 
                       bg-white text-gray-700 
                       border-2 border-blue-200
                       hover:border-blue-300 
                       rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-screen max-w-7xl mx-auto px-8 py-8 flex flex-col">
        {/* Top Section: User Card LEFT + Profile Cards RIGHT */}
        <div className="flex justify-between mb-8">
          {/* LEFT - Client Card (Editable) */}
          <Card className="p-4 w-56 h-fit bg-white shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-600">User Details</h3>
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <label className="block text-[10px] font-medium text-gray-600 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter user name"
                  required
                  className={`w-full px-2 py-1.5 text-xs text-gray-900 rounded border outline-none
                           ${clientName.trim() === '' ? 'border-red-300 focus:ring-2 focus:ring-red-400' : 'border-gray-300 focus:ring-2 focus:ring-cyan-400'}`}
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-600 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="user@email.com"
                  required
                  className={`w-full px-2 py-1.5 text-xs text-gray-900 rounded border outline-none
                           ${clientEmail.trim() === '' ? 'border-red-300 focus:ring-2 focus:ring-red-400' : 'border-gray-300 focus:ring-2 focus:ring-cyan-400'}`}
                />
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-[9px] text-gray-500">Advisor: {userName}</p>
              </div>
            </div>
          </Card>

          {/* RIGHT - Profile Cards Grid (None + 6 Profiles in 2 rows) */}
          <div className="w-auto">
            <div className="grid grid-cols-6 gap-2 mb-3">
              {/* None Card */}
              <ProfileCard
                name="None"
                tag="custom"
                isSelected={selectedProfile === null}
                onClick={() => handleProfileClick(null)}
                isNone
              />

              {/* First 3 Profile Cards */}
              {profiles.slice(0, 7).map((profile) => (
                <ProfileCard
                  key={profile.tag}
                  name={profile.name.split(' - ')[0]}
                  tag={profile.tag}
                  age={profile.demographics.age}
                  isSelected={selectedProfile === profile.tag}
                  onClick={() => handleProfileClick(profile)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Middle Section: Profile Form with All Fields */}
        <Card className="p-6 mb-6 mt-10 bg-white shadow-lg border border-gray-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Client Financial Profile</h2>
          
            {/* Demographics Section */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-cyan-700 mb-3 pb-2 border-b border-cyan-200">Demographics</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Age</label>
                  <input type="number" value={formData.age}
                    onChange={(e) => handleFormChange('age', e.target.value ? Number(e.target.value) : 0)}
                    onFocus={(e) => { if (e.target.value === '0') e.target.select(); }}
                    className="w-full px-3 py-2 text-sm text-gray-900 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                    placeholder="Age" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Employment Type</label>
                  <select value={formData.employmentType}
                    onChange={(e) => handleFormChange('employmentType', e.target.value)}
                    className="w-full px-3 py-2 text-sm text-gray-900 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none cursor-pointer">
                    <option value="">Select type</option>
                    <option value="salaried">Salaried</option>
                    <option value="business_owner">Business Owner</option>
                    <option value="self_employed">Self Employed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Dependents</label>
                  <input type="number" value={formData.dependents}
                    onChange={(e) => handleFormChange('dependents', e.target.value ? Number(e.target.value) : 0)}
                    onFocus={(e) => { if (e.target.value === '0') e.target.select(); }}
                    className="w-full px-3 py-2 text-sm text-gray-900 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                    placeholder="Dependents" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Health Status</label>
                  <select value={formData.healthStatus}
                    onChange={(e) => handleFormChange('healthStatus', e.target.value)}
                    className="w-full px-3 py-2 text-sm text-gray-900 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none cursor-pointer">
                    <option value="">Select</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="moderate">Moderate</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Risk Appetite</label>
                  <select value={formData.riskAppetite}
                    onChange={(e) => handleFormChange('riskAppetite', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm text-gray-900 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none cursor-pointer">
                    <option value={-1}>Low</option>
                    <option value={0}>Moderate</option>
                    <option value={1}>High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Financial Maturity</label>
                  <select value={formData.financialMaturity}
                    onChange={(e) => handleFormChange('financialMaturity', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm text-gray-900 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none cursor-pointer">
                    <option value={-1}>Beginner</option>
                    <option value={0}>Intermediate</option>
                    <option value={1}>Advanced</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Market Outlook</label>
                  <select value={formData.marketOutlook}
                    onChange={(e) => handleFormChange('marketOutlook', e.target.value)}
                    className="w-full px-3 py-2 text-sm text-gray-900 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none cursor-pointer">
                    <option value="">Select</option>
                    <option value="bullish">Bullish</option>
                    <option value="neutral">Neutral</option>
                    <option value="bearish">Bearish</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
                  <select value={formData.location}
                    onChange={(e) => handleFormChange('location', e.target.value)}
                    className="w-full px-3 py-2 text-sm text-gray-900 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none cursor-pointer">
                    <option value="">Select</option>
                    <option value="tier_1">Tier 1 City</option>
                    <option value="tier_2">Tier 2 City</option>
                    <option value="tier_3">Tier 3 City</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Financials Section */}
            <div>
              <h3 className="text-sm font-bold text-cyan-700 mb-3 pb-2 border-b border-cyan-200">Financials</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Current Savings (₹)</label>
                  <input type="number" value={formData.currentSavings}
                    onChange={(e) => handleFormChange('currentSavings', e.target.value ? Number(e.target.value) : 0)}
                    onFocus={(e) => { if (e.target.value === '0') e.target.select(); }}
                    className="w-full px-3 py-2 text-sm text-gray-900 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                    placeholder="Current savings" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Monthly Expenses (₹)</label>
                  <input type="number" value={formData.monthlyExpenses}
                    onChange={(e) => handleFormChange('monthlyExpenses', e.target.value ? Number(e.target.value) : 0)}
                    onFocus={(e) => { if (e.target.value === '0') e.target.select(); }}
                    className="w-full px-3 py-2 text-sm text-gray-900 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                    placeholder="Monthly expenses" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Savings Percentage (%)</label>
                  <input type="number" value={formData.savingsPercentage}
                    onChange={(e) => handleFormChange('savingsPercentage', e.target.value ? Number(e.target.value) : 0)}
                    onFocus={(e) => { if (e.target.value === '0') e.target.select(); }}
                    className="w-full px-3 py-2 text-sm text-gray-900 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                    placeholder="Savings %" min="0" max="100" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Real Estate Value (₹)</label>
                  <input type="number" value={formData.realEstateValue}
                    onChange={(e) => handleFormChange('realEstateValue', e.target.value ? Number(e.target.value) : 0)}
                    onFocus={(e) => { if (e.target.value === '0') e.target.select(); }}
                    className="w-full px-3 py-2 text-sm text-gray-900 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                    placeholder="Real estate value" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Housing Loan</label>
                  <select value={formData.isHousingLoan ? 'yes' : 'no'}
                    onChange={(e) => handleFormChange('isHousingLoan', e.target.value === 'yes')}
                    className="w-full px-3 py-2 text-sm text-gray-900 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none cursor-pointer">
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Real Estate Type</label>
                  <select value={formData.realEstateType}
                    onChange={(e) => handleFormChange('realEstateType', e.target.value)}
                    className="w-full px-3 py-2 text-sm text-gray-900 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none cursor-pointer">
                    <option value="">Select</option>
                    <option value="tier_1_residential">Tier 1 Residential</option>
                    <option value="tier_2_residential">Tier 2 Residential</option>
                    <option value="tier_3_residential">Tier 3 Residential</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Debts (₹)</label>
                  <input type="number" value={formData.debts}
                    onChange={(e) => handleFormChange('debts', e.target.value ? Number(e.target.value) : 0)}
                    onFocus={(e) => { if (e.target.value === '0') e.target.select(); }}
                    className="w-full px-3 py-2 text-sm text-gray-900 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                    placeholder="Total debts" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Business Value (₹)</label>
                  <input type="number" value={formData.businessValue}
                    onChange={(e) => handleFormChange('businessValue', e.target.value ? Number(e.target.value) : 0)}
                    onFocus={(e) => { if (e.target.value === '0') e.target.select(); }}
                    className="w-full px-3 py-2 text-sm text-gray-900 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                    placeholder="Business value" />
                </div>
              </div>
            </div>

            {/* Goals Section */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-cyan-700 pb-2 border-b border-cyan-200 flex-1">Financial Goals</h3>
                <button
                  onClick={addGoal}
                  type="button"
                  className="ml-4 px-3 py-1 text-xs bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded 
                           hover:from-cyan-600 hover:to-blue-600 transition-all shadow-sm"
                >
                  + Add Goal
                </button>
              </div>
              
              {goals.length === 0 ? (
                <p className="text-xs text-gray-500 italic text-center py-4">No goals added yet. Click &quot;+ Add Goal&quot; to add financial goals.</p>
              ) : (
                <div className="space-y-3">
                  {goals.map((goal, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 items-end p-3 bg-cyan-50 rounded border border-cyan-100">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Goal Name</label>
                        <input
                          type="text"
                          value={goal.goal}
                          onChange={(e) => updateGoal(index, 'goal', e.target.value)}
                          placeholder="e.g., House down payment"
                          className="w-full px-3 py-2 text-sm text-gray-900 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Goal Value (₹)</label>
                        <input
                          type="number"
                          value={goal.goal_value}
                          onChange={(e) => updateGoal(index, 'goal_value', Number(e.target.value))}
                          onFocus={(e) => { if (e.target.value === '0') e.target.select(); }}
                          placeholder="Target amount"
                          className="w-full px-3 py-2 text-sm text-gray-900 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Timeline (years)</label>
                        <input
                          type="number"
                          value={goal.timeline}
                          onChange={(e) => updateGoal(index, 'timeline', Number(e.target.value))}
                          min="1"
                          max="30"
                          placeholder="Years"
                          className="w-full px-3 py-2 text-sm text-gray-900 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Priority (1-10)</label>
                          <input
                            type="number"
                            value={goal.priority}
                            onChange={(e) => updateGoal(index, 'priority', Number(e.target.value))}
                            min="1"
                            max="10"
                            placeholder="Priority"
                            className="w-full px-3 py-2 text-sm text-gray-900 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">&nbsp;</label>
                          <button
                            type="button"
                            onClick={() => removeGoal(index)}
                            className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-all"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Bottom Section: Generate Button */}
        <div className="flex flex-col items-center py-4 gap-2">
          {error && (
            <p className="text-xs text-red-500 font-medium">
               {error}
            </p>
          )}
          {!isClientInfoValid() && (
            <p className="text-xs text-red-500 font-medium">
              ⚠️ Please enter client name and email to generate
            </p>
          )}
          {(selectedProfile === null && !hasFormData()) || !isClientInfoValid() ? (
            <button
              disabled
              className="bg-cyan-200 text-cyan-400 
                       font-bold py-4 px-16 rounded-lg cursor-not-allowed opacity-50"
            >
              Generate Plan
            </button>
          ) : (
            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 
                       text-white font-bold py-4 px-16 rounded-lg
                       transition-all duration-200 transform hover:scale-105 active:scale-95
                       shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Plan'
              )}
            </button>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setPendingProfile(null);
        }}
        onConfirm={handleConfirmProfileChange}
        profileName={pendingProfile?.name || ''}
      />
    </div>
  );
}
