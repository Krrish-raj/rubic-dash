/**
 * Comprehensive Analysis Display Component
 * Shows complete financial analysis including retirement and withdrawals
 */

import React from 'react';
import Card from './Card';

interface SimpleAnalysis {
  overall_health_score: number;
  goals_funded_count: number;
  retirement_readiness_score: number;
  monthly_savings_capacity: number;
  retirement_analysis?: {
    corpus_available: number;
    corpus_needed: number;
    surplus_deficit: number;
    years_to_retirement: number;
  };
  monthly_withdrawal?: {
    total_withdrawal_needed: number;
    urgency_level: string;
    is_valid: boolean;
  };
  warnings: string[];
  recommendations: string[];
}

interface ComprehensiveAnalysisDisplayProps {
  analysis: SimpleAnalysis;
  clientName: string;
}

export default function ComprehensiveAnalysisDisplay({ 
  analysis, 
  clientName 
}: ComprehensiveAnalysisDisplayProps) {
  return (
    <div className="mb-8">
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 ">
            📊 Financial Health Overview for {clientName}
          </h2>
          
          {/* Overall Health Score */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50  rounded-lg">
              <div className="text-3xl font-bold text-blue-600 ">
                {analysis.overall_health_score}
              </div>
              <div className="text-sm text-gray-600  mt-1">
                Overall Health Score
              </div>
            </div>
            
            <div className="text-center p-4 bg-green-50  rounded-lg">
              <div className="text-3xl font-bold text-green-600 ">
                {analysis.goals_funded_count}
              </div>
              <div className="text-sm text-gray-600  mt-1">
                Feasible Goals
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50  rounded-lg">
              <div className="text-3xl font-bold text-purple-600 ">
                {analysis.retirement_readiness_score.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600  mt-1">
                Retirement Readiness
              </div>
            </div>
            
            <div className="text-center p-4 bg-cyan-50  rounded-lg">
              <div className="text-3xl font-bold text-cyan-600 ">
                ₹{(analysis.monthly_savings_capacity / 1000).toFixed(0)}k
              </div>
              <div className="text-sm text-gray-600  mt-1">
                Monthly Savings
              </div>
            </div>
          </div>

          {/* Retirement Analysis */}
          {analysis.retirement_analysis && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 ">
                🏖️ Retirement Planning
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border border-gray-200  rounded-lg">
                  <div className="text-sm text-gray-600 ">Corpus Available</div>
                  <div className="text-xl font-bold text-gray-900 ">
                    ₹{(analysis.retirement_analysis.corpus_available / 100000).toFixed(1)}L
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200  rounded-lg">
                  <div className="text-sm text-gray-600 ">Corpus Needed</div>
                  <div className="text-xl font-bold text-gray-900 ">
                    ₹{(analysis.retirement_analysis.corpus_needed / 100000).toFixed(1)}L
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200  rounded-lg">
                  <div className="text-sm text-gray-600 ">Surplus/Deficit</div>
                  <div className={`text-xl font-bold ${analysis.retirement_analysis.surplus_deficit >= 0 ? 'text-green-600 ' : 'text-red-600 '}`}>
                    ₹{(Math.abs(analysis.retirement_analysis.surplus_deficit) / 100000).toFixed(1)}L
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200  rounded-lg">
                  <div className="text-sm text-gray-600 ">Years to Retirement</div>
                  <div className="text-xl font-bold text-gray-900 ">
                    {analysis.retirement_analysis.years_to_retirement}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Monthly Withdrawal Analysis */}
          {analysis.monthly_withdrawal && analysis.monthly_withdrawal.total_withdrawal_needed > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 ">
                💸 Current Month Withdrawals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200  rounded-lg">
                  <div className="text-sm text-gray-600 ">Total Needed</div>
                  <div className="text-xl font-bold text-gray-900 ">
                    ₹{(analysis.monthly_withdrawal.total_withdrawal_needed / 1000).toFixed(0)}k
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200  rounded-lg">
                  <div className="text-sm text-gray-600 ">Urgency Level</div>
                  <div className="text-xl font-bold text-gray-900  capitalize">
                    {analysis.monthly_withdrawal.urgency_level}
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200  rounded-lg">
                  <div className="text-sm text-gray-600 ">Validation</div>
                  <div className="text-xl font-bold">
                    {analysis.monthly_withdrawal.is_valid ? (
                      <span className="text-green-600 ">✓ Valid</span>
                    ) : (
                      <span className="text-red-600 ">✗ Issues</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Warnings */}
          {analysis.warnings.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 ">
                ⚠️ Warnings
              </h3>
              <div className="space-y-2">
                {analysis.warnings.map((warning, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-yellow-50  border border-yellow-200  rounded-lg text-sm text-yellow-800 "
                  >
                    {warning}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 ">
                💡 Recommendations
              </h3>
              <div className="space-y-2">
                {analysis.recommendations.map((recommendation, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-blue-50  border border-blue-200  rounded-lg text-sm text-blue-800 "
                  >
                    {recommendation}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

