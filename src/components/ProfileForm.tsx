'use client';

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
  realEstateType: string;
  currentSavings: number;
  debts: number;
  businessValue: number;
}

interface ProfileFormProps {
  formData: ProfileFormData;
  onChange: (field: keyof ProfileFormData, value: string | number | boolean) => void;
}

export default function ProfileForm({ formData, onChange }: ProfileFormProps) {
  return (
    <div className="space-y-5">
      {/* Demographics Section */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50                      border-2 border-blue-200  shadow-xl">
        <div className="flex items-center mb-5">
          <div className="w-1.5 h-7 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-3 shadow-md" />
          <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent  ">
            Demographics
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Age */}
          <div>
            <label className="block text-sm font-semibold text-gray-700  mb-2">
              Age
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => onChange('age', e.target.value ? Number(e.target.value) : 0)}
              onFocus={(e) => { if (e.target.value === '0') e.target.select(); }}
              className="w-full px-4 py-2.5 border-2 border-blue-200  rounded-xl
                       bg-white  text-gray-900  shadow-sm
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-400                        transition-all duration-200 outline-none hover:border-blue-300 
 hover:shadow-md"
              placeholder="Enter age"
            />
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700  mb-2">
              Employment Type
            </label>
            <select
              value={formData.employmentType}
              onChange={(e) => onChange('employmentType', e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-blue-200  rounded-xl
                       bg-white  text-gray-900  shadow-sm
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-400                        transition-all duration-200 outline-none hover:border-blue-300 
 hover:shadow-md cursor-pointer"
            >
              <option value="">Select employment type</option>
              <option value="salaried">Salaried</option>
              <option value="business_owner">Business Owner</option>
              <option value="self_employed">Self Employed</option>
            </select>
          </div>

          {/* Dependents */}
          <div>
            <label className="block text-sm font-semibold text-gray-700  mb-2">
              Dependents
            </label>
            <input
              type="number"
              value={formData.dependents}
              onChange={(e) => onChange('dependents', e.target.value ? Number(e.target.value) : 0)}
              onFocus={(e) => { if (e.target.value === '0') e.target.select(); }}
              className="w-full px-4 py-2.5 border-2 border-blue-200  rounded-xl
                       bg-white  text-gray-900  shadow-sm
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-400                        transition-all duration-200 outline-none hover:border-blue-300 
 hover:shadow-md"
              placeholder="Number of dependents"
            />
          </div>

          

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700  mb-2">
              Location
            </label>
            <select
              value={formData.location}
              onChange={(e) => onChange('location', e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-blue-200  rounded-xl
                       bg-white  text-gray-900  shadow-sm
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-400                        transition-all duration-200 outline-none hover:border-blue-300 
 hover:shadow-md cursor-pointer"
            >
              <option value="">Select location</option>
              <option value="tier_1">Tier 1</option>
              <option value="tier_2">Tier 2</option>
              <option value="tier_3">Tier 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Financials Section */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50                      border-2 border-blue-200  shadow-xl">
        <div className="flex items-center mb-5">
          <div className="w-1.5 h-7 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-3 shadow-md" />
          <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent  ">
            Financials
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Monthly Expenses */}
          <div>
            <label className="block text-sm font-semibold text-gray-700  mb-2">
              Monthly Expenses (₹)
            </label>
            <input
              type="number"
              value={formData.monthlyExpenses}
              onChange={(e) => onChange('monthlyExpenses', e.target.value ? Number(e.target.value) : 0)}
              onFocus={(e) => { if (e.target.value === '0') e.target.select(); }}
              className="w-full px-4 py-2.5 border-2 border-blue-200  rounded-xl
                       bg-white  text-gray-900  shadow-sm
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-400                        transition-all duration-200 outline-none hover:border-blue-300 
 hover:shadow-md"
              placeholder="Enter monthly expenses"
            />
          </div>

          {/* Savings Percentage */}
          <div>
            <label className="block text-sm font-semibold text-gray-700  mb-2">
              Savings Percentage (%)
            </label>
            <input
              type="number"
              value={formData.savingsPercentage}
              onChange={(e) => onChange('savingsPercentage', e.target.value ? Number(e.target.value) : 0)}
              onFocus={(e) => { if (e.target.value === '0') e.target.select(); }}
              className="w-full px-4 py-2.5 border-2 border-blue-200  rounded-xl
                       bg-white  text-gray-900  shadow-sm
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-400                        transition-all duration-200 outline-none hover:border-blue-300 
 hover:shadow-md"
              placeholder="Enter savings percentage"
              min="0"
              max="100"
            />
          </div>

          

          {/* Current Savings */}
          <div>
            <label className="block text-sm font-semibold text-gray-700  mb-2">
              Current Savings & Investments (₹)
            </label>
            <input
              type="number"
              value={formData.currentSavings}
              onChange={(e) => onChange('currentSavings', e.target.value ? Number(e.target.value) : 0)}
              onFocus={(e) => { if (e.target.value === '0') e.target.select(); }}
              className="w-full px-4 py-2.5 border-2 border-blue-200  rounded-xl
                       bg-white  text-gray-900  shadow-sm
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-400                        transition-all duration-200 outline-none hover:border-blue-300 
 hover:shadow-md"
              placeholder="Enter current savings"
            />
          </div>

          {/* Debts */}
          <div>
            <label className="block text-sm font-semibold text-gray-700  mb-2">
              Debts (₹)
            </label>
            <input
              type="number"
              value={formData.debts}
              onChange={(e) => onChange('debts', e.target.value ? Number(e.target.value) : 0)}
              onFocus={(e) => { if (e.target.value === '0') e.target.select(); }}
              className="w-full px-4 py-2.5 border-2 border-blue-200  rounded-xl
                       bg-white  text-gray-900  shadow-sm
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-400                        transition-all duration-200 outline-none hover:border-blue-300 
 hover:shadow-md"
              placeholder="Enter total debts"
            />
          </div>

          
        </div>
      </div>
    </div>
  );
}

