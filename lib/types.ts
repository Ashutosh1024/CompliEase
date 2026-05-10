// Types for the MSME Platform

export interface BusinessProfile {
  // Personal
  fullName: string;
  mobile: string;
  email: string;
  // Business
  businessName: string;
  businessType: string;
  industryCategory: string;
  natureOfBusiness: string;
  businessStructure: 'Proprietorship' | 'Partnership' | 'LLP' | 'Pvt Ltd' | '';
  // Registration
  gstNumber: string;
  panNumber: string;
  aadhaarNumber: string;  // 12-digit Aadhaar (masked in UI)
  udyamNumber: string;
  cinNumber: string;
  hasTradeLicense: boolean;
  hasFSSAI: boolean;
  hasShopAct: boolean;
  // Location
  state: string;
  district: string;
  address: string;
  pinCode: string;
  // Operational
  annualTurnover: string;
  employeeCount: string;
  yearEstablished: string;
  // Plan
  plan: 'free' | 'premium';
}

export interface ComplianceItem {
  id: string;
  name: string;
  category: 'Tax' | 'License' | 'Registration' | 'Filing';
  status: 'completed' | 'pending' | 'missing';
  dueDate?: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface GovernmentScheme {
  id: string;
  name: string;
  ministry: string;
  description: string;
  eligibilityScore: number;
  benefits: string[];
  requiredDocuments: string[];
  applyLink: string;
  category: 'Loan' | 'Subsidy' | 'Registration' | 'Grant';
}

export interface SmartAlert {
  id: string;
  type: 'urgent' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  dueDate?: string;
  actionLabel?: string;
  actionLink?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  timestamp: Date;
  read: boolean;
}
