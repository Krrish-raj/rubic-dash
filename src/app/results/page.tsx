'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Mail, Download, TrendingUp, DollarSign, LogOut } from 'lucide-react';
import Card from '@/components/Card';
import { generatePDF } from '@/components/PDFDocument';
import { GeneratePlanResponse, AssetAllocation } from '@/utils/api';

interface AllocationItem {
  name: string;
  amount: number;
  percentage: number;
  category: string;
}

interface UserData {
  email?: string;
  id: string;
}

interface AllocationItem {
  name: string;
  amount: number;
  percentage: number;
  category: string;
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState<GeneratePlanResponse | null>(null);
  const [allocations, setAllocations] = useState<AllocationItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        router.push('/login');
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);


  const processPlanData = (plan: GeneratePlanResponse) => {
    // Convert asset allocations to our format
    const allocations: AllocationItem[] = plan.asset_allocations.map((allocation: AssetAllocation) => ({
      name: allocation.name.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      amount: allocation.amount,
      percentage: allocation.percentage,
      category: allocation.name,
    }));

    setAllocations(allocations);
    
    // Calculate total amount from asset allocations since monthly_action_plan might not exist
    const totalAmount = plan.asset_allocations.reduce((sum, allocation) => sum + allocation.amount, 0);
    setTotalAmount(totalAmount);
  };

  useEffect(() => {
    // Check if we have generated data
    const isGenerated = searchParams.get('generated');
    
    if (isGenerated === 'true') {
      // Get data from sessionStorage
      try {
        const storedPlan = sessionStorage.getItem('generatedPlan');
        const storedClient = sessionStorage.getItem('clientInfo');
        
        if (storedPlan && storedClient) {
          const plan = JSON.parse(storedPlan) as GeneratePlanResponse;
          const clientInfo = JSON.parse(storedClient);
          
          setPlanData(plan);
          setClientName(clientInfo.name || 'Client');
          setClientEmail(clientInfo.email || 'Not provided');
          processPlanData(plan);
          
          // Clean up sessionStorage after a delay to ensure data is processed
          setTimeout(() => {
            sessionStorage.removeItem('generatedPlan');
            sessionStorage.removeItem('clientInfo');
          }, 1000);
        } else {
          console.error('No plan data found in sessionStorage');
          // Don't redirect immediately, show error instead
          setError('No plan data found. Please generate a plan first.');
        }
      } catch (error) {
        console.error('Error parsing stored data:', error);
        setError('Error loading plan data. Please try again.');
      }
    } else {
      // Fallback to URL params for backward compatibility
      const planStr = searchParams.get('plan');
      const clientStr = searchParams.get('client');
      
      // Parse client details
      if (clientStr) {
        try {
          const clientInfo = JSON.parse(decodeURIComponent(clientStr));
          setClientName(clientInfo.name || 'Client');
          setClientEmail(clientInfo.email || 'Not provided');
        } catch {
          setClientName('Client');
          setClientEmail('Not provided');
        }
      }

      // Parse plan data
      if (planStr) {
        try {
          const plan = JSON.parse(decodeURIComponent(planStr)) as GeneratePlanResponse;
          setPlanData(plan);
          processPlanData(plan);
        } catch (error) {
          console.error('Error parsing plan data:', error);
          setError('Error loading plan data. Please try again.');
        }
      } else {
        setError('No plan data found. Please generate a plan first.');
      }
    }
  }, [searchParams, router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleDownload = async () => {
    await generatePDF(clientName, clientEmail, allocations, totalAmount, planData || undefined);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 via-blue-100 to-blue-200">
        <div className="text-gray-600">Loading user data...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-blue-200">
        {/* Navigation Bar */}
        <nav className="bg-white shadow border-b border-gray-300">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-sm font-semobold text-gray-600 hover:text-gray-900 
                           transition-colors"
                >
                  ←
                </button>
                <h1 className="text-xl font-bold text-gray-900">
                  {error || 'Error'}
                </h1>
              </div>
            </div>
          </div>
        </nav>

        {/* Error Content */}
        <main className="max-w-4xl mx-auto px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {error}
                </h3>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Go Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-blue-200">
      {/* Navigation Bar */}
      <nav className="bg-white shadow border-b border-gray-300">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-sm font-semobold text-gray-600 hover:text-gray-900 
                         transition-colors"
              >
                ←
              </button>
              <h1 className="text-xl font-bold text-gray-900">
                {planData?.message || 'Allocation Results'}
              </h1>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 text-sm font-medium 
                       bg-white text-gray-700 
                       border border-gray-300
                       hover:border-gray-400 
                       rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className=" max-w-7xl mx-auto px-8 py-8 flex flex-col">
        {/* Top Section: Name Card LEFT + Asset Allocation Summary RIGHT */}
        <div className="flex justify-between mb-8">
          {/* Left - Client Name Card */}
          <Card className="p-4 w-52 bg-white shadow-lg border border-gray-100 h-fit">
            <h3 className="text-xs font-semibold text-gray-600 mb-2 text-center">{clientName ? 'Client' : 'Profile'}</h3>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full 
                           flex items-center justify-center shadow-md mb-2">
                <span className="text-base font-bold text-white">
                  {clientName.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-sm font-bold text-gray-800 mb-1">
                {clientName}
              </h2>
              <div className="flex items-center justify-center text-[10px] text-gray-500">
                <Mail className="w-2.5 h-2.5 mr-1" />
                <span className="truncate">{clientEmail}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200 w-full">
                <p className="text-[9px] text-gray-500">{planData?.success ? 'Plan Generated' : 'Generated Plan'}</p>
              </div>
            </div>
          </Card>

          {/* Right - Asset Allocation Summary */}
          <Card className="p-4 w-64 bg-white shadow-lg border border-gray-100 h-fit">
            <h3 className="text-base font-bold text-gray-800 mb-3">
              {planData?.asset_allocations?.length ? `Asset Allocation (${planData.asset_allocations.length} categories)` : 'Asset Allocation'}
            </h3>
            
            <div className="space-y-2">
              <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-600">Total Amount</span>
                  <DollarSign className="w-3.5 h-3.5 text-cyan-500" />
                </div>
                <p className="text-lg font-bold text-gray-900">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Middle - Allocation Details */}
        <Card className="p-6 bg-white shadow-lg border border-gray-100 flex-1">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {planData?.message || 'Generated Allocation'}
          </h2>

          {/* Allocation Grid - 2x2 */}
          <div className="grid grid-cols-2 gap-4">
            {allocations.map((allocation, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-cyan-50 
                         border border-cyan-100 flex flex-col shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-800">
                    {allocation.name}
                  </h3>
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full 
                               flex items-center justify-center shadow-sm">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-xs text-gray-600">Amount</p>
                    <p className="text-base font-bold text-gray-900">
                      ₹{allocation.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Percentage</p>
                    <p className="text-base font-bold text-cyan-700">
                      {allocation.percentage}%
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 w-full bg-cyan-200 rounded-full h-1.5">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    style={{ width: `${allocation.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Asset Allocations Details */}
        {planData && (
          <Card className="p-6 bg-white shadow-lg border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {planData?.asset_allocations?.length ? `Asset Allocations (${planData.asset_allocations.length} categories)` : 'Asset Allocations'}
            </h2>
            <div className="space-y-4">
              {planData.asset_allocations.map((allocation, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800">
                      {allocation.name.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </h3>
                    <div className="text-right">
                      <p className="text-xl font-bold text-cyan-700">₹{allocation.amount.toLocaleString('en-IN')}</p>
                      <p className="text-sm text-gray-600">{allocation.percentage.toFixed(2)}%</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Risk Level:</span>
                      <p className="font-semibold text-gray-800">{allocation.riskiness}/2</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Liquidity:</span>
                      <p className="font-semibold text-gray-800">{allocation.illiquidity}/2</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Currency:</span>
                      <p className="font-semibold text-gray-800">{allocation.currency.toUpperCase()}</p>
                    </div>
                  </div>

                  {allocation.explanation && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Description:</h4>
                        <p className="text-sm text-gray-600">{allocation.explanation.description}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Risk Profile:</h4>
                        <p className="text-sm text-gray-600">{allocation.explanation.risk}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Liquidity:</h4>
                        <p className="text-sm text-gray-600">{allocation.explanation.illiquidity}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Bottom Section: Download Button */}
        <div className="flex justify-center py-4">
          <button
            onClick={handleDownload}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 
                     text-white font-bold py-3 px-12 rounded-lg
                     transition-all duration-200 transform hover:scale-105 active:scale-95
                     shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 via-blue-100 to-blue-200">
        <div className="text-gray-600">Loading financial plan...</div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}

