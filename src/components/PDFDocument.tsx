'use client';

import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { GeneratePlanResponse } from '@/utils/api';

interface AllocationItem {
  name: string;
  amount: number;
  percentage: number;
  category: string;
}

interface FormData {
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

interface Goal {
  timeline: number;
  goal: string;
  goal_value: number;
  priority: number;
}

interface PDFDocumentProps {
  clientName: string;
  clientEmail: string;
  allocations: AllocationItem[];
  totalAmount: number;
  planData?: GeneratePlanResponse;
  formData?: FormData;
  goals?: Goal[];
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 25,
    borderBottom: '1 solid #000000',
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 11,
    color: '#4B5563',
    marginBottom: 3,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottom: '1 solid #D1D5DB',
  },
  summaryBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 4,
    marginBottom: 20,
    border: '1 solid #E5E7EB',
  },
  summaryText: {
    fontSize: 11,
    color: '#4B5563',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  allocationCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 4,
    marginBottom: 10,
    border: '1 solid #D1D5DB',
  },
  allocationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  allocationName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
  },
  allocationPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  allocationAmount: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: '1 solid #D1D5DB',
    fontSize: 9,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metricBox: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 4,
    border: '1 solid #E5E7EB',
    flex: 1,
    marginHorizontal: 4,
  },
  metricLabel: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    paddingLeft: 8,
  },
  bulletPoint: {
    width: 4,
    height: 4,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
    marginTop: 6,
    marginRight: 8,
  },
  actionText: {
    fontSize: 10,
    color: '#374151',
    flex: 1,
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 4,
    border: '1 solid #F59E0B',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 10,
    color: '#92400E',
  },
  goalCard: {
    backgroundColor: '#F0F9FF',
    padding: 8,
    borderRadius: 4,
    border: '1 solid #BAE6FD',
    marginBottom: 8,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  goalName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
  },
  goalPriority: {
    fontSize: 9,
    color: '#6B7280',
  },
  goalMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalMetric: {
    flex: 1,
    marginHorizontal: 2,
  },
  goalMetricLabel: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 2,
  },
  goalMetricValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0369A1',
  },
  formSection: {
    marginBottom: 15,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: '1 solid #E5E7EB',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  formLabel: {
    fontSize: 10,
    color: '#6B7280',
    flex: 1,
  },
  formValue: {
    fontSize: 10,
    color: '#000000',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    paddingLeft: 8,
  },
  goalBullet: {
    width: 3,
    height: 3,
    backgroundColor: '#3B82F6',
    borderRadius: 1.5,
    marginTop: 4,
    marginRight: 6,
  },
  goalText: {
    fontSize: 9,
    color: '#374151',
    flex: 1,
  },
});

const AllocationPDF = ({ clientName, clientEmail, allocations, totalAmount, planData, formData, goals }: PDFDocumentProps) => (
  <Document>
    {/* Page 1: Overview and Form Data */}
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Personal Finance Report</Text>
        <Text style={styles.subtitle}>Name: {clientName}</Text>
        <Text style={styles.subtitle}>Email: {clientEmail}</Text>
        <Text style={styles.subtitle}>Generated: {planData?.timestamp ? new Date(planData.timestamp).toLocaleDateString('en-IN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) : new Date().toLocaleDateString('en-IN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</Text>
      </View>

      {/* Summary */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>Total Investment Amount</Text>
        <Text style={styles.summaryAmount}>{totalAmount.toLocaleString('en-IN')}</Text>
      </View>

      {/* Form Data */}
      {formData && (
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Personal Information & Financial Details</Text>
          
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Age:</Text>
            <Text style={styles.formValue}>{formData.age} years</Text>
          </View>
          
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Employment Type:</Text>
            <Text style={styles.formValue}>{formData.employmentType.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</Text>
          </View>
          
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Dependents:</Text>
            <Text style={styles.formValue}>{formData.dependents}</Text>
          </View>
          
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Health Status:</Text>
            <Text style={styles.formValue}>{formData.healthStatus.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</Text>
          </View>
          
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Risk Appetite:</Text>
            <Text style={styles.formValue}>{formData.riskAppetite === -1 ? 'Conservative' : formData.riskAppetite === 0 ? 'Moderate' : 'Aggressive'}</Text>
          </View>
          
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Financial Maturity:</Text>
            <Text style={styles.formValue}>{formData.financialMaturity === -1 ? 'Beginner' : formData.financialMaturity === 0 ? 'Intermediate' : 'Advanced'}</Text>
          </View>
          
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Market Outlook:</Text>
            <Text style={styles.formValue}>{formData.marketOutlook.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</Text>
          </View>
          
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Location:</Text>
            <Text style={styles.formValue}>{formData.location.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</Text>
          </View>
          
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Monthly Expenses:</Text>
            <Text style={styles.formValue}>{formData.monthlyExpenses.toLocaleString('en-IN')}</Text>
          </View>
          
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Savings Percentage:</Text>
            <Text style={styles.formValue}>{formData.savingsPercentage}%</Text>
          </View>
          
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Real Estate Value:</Text>
            <Text style={styles.formValue}>{formData.realEstateValue.toLocaleString('en-IN')}</Text>
          </View>
          
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Housing Loan:</Text>
            <Text style={styles.formValue}>{formData.isHousingLoan ? 'Yes' : 'No'}</Text>
          </View>
          
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Real Estate Type:</Text>
            <Text style={styles.formValue}>{formData.realEstateType.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</Text>
          </View>
          
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Current Savings:</Text>
            <Text style={styles.formValue}>{formData.currentSavings.toLocaleString('en-IN')}</Text>
          </View>
          
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Debts:</Text>
            <Text style={styles.formValue}>{formData.debts.toLocaleString('en-IN')}</Text>
          </View>
          
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Business Value:</Text>
            <Text style={styles.formValue}>{formData.businessValue.toLocaleString('en-IN')}</Text>
          </View>
        </View>
      )}

      {/* Goals */}
      {goals && goals.length > 0 && (
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Financial Goals</Text>
          {goals.map((goal, index) => (
            <View key={index} style={styles.goalItem}>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={styles.goalBullet} />
                <Text style={styles.goalText}>
                  {goal.goal} - {goal.goal_value.toLocaleString('en-IN')} (Timeline: {goal.timeline} years, Priority: {goal.priority}/10)
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text>This report is generated by Personal Finance App</Text>
        <Text>For informational purposes only. Please consult a financial advisor for personalized advice.</Text>
      </View>
    </Page>

    {/* Page 2: Asset Allocations */}
    <Page size="A4" style={styles.page}>
      
      

      {/* Allocations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {planData?.asset_allocations?.length ? `Asset Allocations (${planData.asset_allocations.length} categories)` : 'Asset Allocations'}
        </Text>
        
        {allocations.map((allocation, index) => (
          <View key={index} style={styles.allocationCard}>
            <View style={styles.allocationHeader}>
              <Text style={styles.allocationName}>{allocation.name}</Text>
              <Text style={styles.allocationPercentage}>{Math.round(allocation.percentage)}%</Text>
            </View>
            <Text style={styles.allocationAmount}>{allocation.amount.toLocaleString('en-IN')}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>This report is generated by Personal Finance App</Text>
        <Text>For informational purposes only. Please consult a financial advisor for personalized advice.</Text>
      </View>
    </Page>
  </Document>
);

export const generatePDF = async (
  clientName: string,
  clientEmail: string,
  allocations: AllocationItem[],
  totalAmount: number,
  planData?: GeneratePlanResponse,
  formData?: FormData,
  goals?: Goal[]
) => {
  const blob = await pdf(
    <AllocationPDF
      clientName={clientName}
      clientEmail={clientEmail}
      allocations={allocations}
      totalAmount={totalAmount}
      planData={planData}
      formData={formData}
      goals={goals}
    />
  ).toBlob();
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `asset-allocation-report-${new Date().getTime()}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};

export default AllocationPDF;

