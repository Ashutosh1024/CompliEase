import { BusinessProfile, ComplianceItem, GovernmentScheme, SmartAlert } from './types';

// State-wise compliance rules
const stateRules: Record<string, string[]> = {
  'Maharashtra': ['Shop & Establishment Act', 'Professional Tax Registration', 'MLWF Registration'],
  'Karnataka': ['Shop & Establishment Act', 'Professional Tax', 'PT Returns'],
  'Delhi': ['Shop & Establishment Act', 'Delhi Sales Tax (if applicable)'],
  'Uttar Pradesh': ['Shop & Establishment Act', 'UP Labour Welfare Fund'],
  'Tamil Nadu': ['Shops & Establishments Act', 'Professional Tax'],
  'Gujarat': ['Shops & Establishments Act', 'Gujarat Labour Welfare Fund'],
  'Rajasthan': ['Rajasthan Shop & Establishment Act'],
  'West Bengal': ['West Bengal Shops Act', 'Professional Tax'],
  'Telangana': ['Telangana Shops Act', 'Professional Tax'],
  'Andhra Pradesh': ['AP Shops Act', 'Professional Tax'],
};

// Industry compliance requirements
const industryCompliance: Record<string, string[]> = {
  'Restaurant / Food': ['FSSAI License', 'GST Registration', 'Shop & Establishment', 'Fire NOC', 'Health Trade License'],
  'Manufacturing': ['Factory License', 'GST Registration', 'Pollution Control NOC', 'MSME/Udyam Registration'],
  'Retail / Shop': ['Shop & Establishment Act', 'GST Registration (if turnover > 40L)', 'Trade License'],
  'IT / Software': ['GST Registration', 'Professional Tax', 'Software Technology Parks (optional)'],
  'Healthcare / Clinic': ['Clinical Establishment Registration', 'Drug License', 'Bio-medical Waste'],
  'Construction': ['ESI Registration', 'PF Registration', 'GST', 'MSME Registration'],
  'Trading': ['GST Registration', 'Import Export Code (if applicable)', 'Trade License'],
  'Education': ['Recognition from Board', 'Shop & Establishment', 'GST (if applicable)'],
  'Beauty / Salon': ['Shop & Establishment', 'Trade License', 'GST (if turnover > 20L)'],
  'Freelancer / Consultant': ['GST Registration (if > 20L)', 'Professional Tax', 'Income Tax Filing'],
};

// Government Schemes Database
export const GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: 'mudra-shishu',
    name: 'PM Mudra Yojana – Shishu',
    ministry: 'Ministry of Finance',
    description: 'Loans up to ₹50,000 for micro enterprises and new businesses starting out.',
    eligibilityScore: 90,
    benefits: ['Loan up to ₹50,000', 'No collateral required', 'Low interest rates', 'Quick approval'],
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Business Plan', 'Bank Statement'],
    applyLink: 'https://www.mudra.org.in',
    category: 'Loan',
  },
  {
    id: 'mudra-kishore',
    name: 'PM Mudra Yojana – Kishore',
    ministry: 'Ministry of Finance',
    description: 'Loans between ₹50,000 to ₹5 Lakhs for established micro businesses.',
    eligibilityScore: 80,
    benefits: ['Loan ₹50K–₹5L', 'No collateral', 'Flexible repayment', 'Low interest'],
    requiredDocuments: ['Aadhaar', 'PAN', 'Business registration', '6-month bank statement', 'Income proof'],
    applyLink: 'https://www.mudra.org.in',
    category: 'Loan',
  },
  {
    id: 'pmegp',
    name: 'PMEGP – Prime Minister Employment Generation Programme',
    ministry: 'MSME Ministry',
    description: 'Subsidy up to 35% for setting up new manufacturing or service enterprises.',
    eligibilityScore: 70,
    benefits: ['Subsidy 15–35% of project cost', 'Project up to ₹50L (manufacturing)', 'Bank loan assistance'],
    requiredDocuments: ['Aadhaar', 'PAN', 'Educational Certificate', 'Business Plan', 'Caste Certificate (if applicable)'],
    applyLink: 'https://www.kviconline.gov.in/pmegpeportal',
    category: 'Subsidy',
  },
  {
    id: 'udyam',
    name: 'Udyam Registration (MSME)',
    ministry: 'MSME Ministry',
    description: 'Free registration giving access to priority lending, subsidies, and government tenders.',
    eligibilityScore: 95,
    benefits: ['Priority sector lending', 'Lower bank interest', 'Govt. tender preference', 'Subsidy on patents & trademarks'],
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'GST Number (optional)'],
    applyLink: 'https://udyamregistration.gov.in',
    category: 'Registration',
  },
  {
    id: 'startup-india',
    name: 'Startup India Initiative',
    ministry: 'DPIIT, Ministry of Commerce',
    description: 'Recognition for startups with tax benefits, faster exits, and funding support.',
    eligibilityScore: 60,
    benefits: ['3-year tax holiday', 'Easy winding up', 'Fund of Funds access', 'Self-certification'],
    requiredDocuments: ['Incorporation Certificate', 'PAN', 'Pitch Deck', 'DPIIT Application'],
    applyLink: 'https://www.startupindia.gov.in',
    category: 'Grant',
  },
  {
    id: 'cgtmse',
    name: 'CGTMSE – Credit Guarantee Fund',
    ministry: 'MSME Ministry + SIDBI',
    description: 'Collateral-free loans up to ₹2 Crore for MSMEs through this credit guarantee scheme.',
    eligibilityScore: 65,
    benefits: ['No collateral loans up to ₹2 Cr', 'Credit guarantee cover', 'For existing & new MSMEs'],
    requiredDocuments: ['Udyam Certificate', 'Business Financials', 'Bank Statements', 'Project Report'],
    applyLink: 'https://www.cgtmse.in',
    category: 'Loan',
  },
];

// GST Filing Deadlines
export const GST_DEADLINES = [
  { name: 'GSTR-3B (Monthly)', dueDay: 20, frequency: 'monthly', description: 'Monthly GST summary return' },
  { name: 'GSTR-1 (Monthly)', dueDay: 11, frequency: 'monthly', description: 'Monthly outward supplies return' },
  { name: 'GSTR-9 (Annual)', month: 12, dueDay: 31, frequency: 'annual', description: 'Annual GST return' },
];

// Analyze business and return compliance items
export const analyzeCompliance = (profile: BusinessProfile): ComplianceItem[] => {
  const items: ComplianceItem[] = [];
  const turnover = parseInt(profile.annualTurnover?.replace(/[^0-9]/g, '') || '0');

  // GST Check
  const gstThreshold = profile.industryCategory?.includes('Service') ? 2000000 : 4000000;
  if (profile.gstNumber) {
    items.push({ id: 'gst-reg', name: 'GST Registration', category: 'Registration', status: 'completed', description: 'GST registered', priority: 'high' });
    items.push({ id: 'gstr3b', name: 'GSTR-3B Monthly Filing', category: 'Filing', status: 'pending', dueDate: getNextMonthDate(20), description: 'Monthly GST return due on 20th', priority: 'high' });
    items.push({ id: 'gstr1', name: 'GSTR-1 Monthly Filing', category: 'Filing', status: 'pending', dueDate: getNextMonthDate(11), description: 'Outward supplies return due on 11th', priority: 'high' });
  } else {
    if (turnover > gstThreshold) {
      items.push({ id: 'gst-reg', name: 'GST Registration', category: 'Registration', status: 'missing', description: 'Mandatory if turnover exceeds threshold', priority: 'high' });
    } else {
      items.push({ id: 'gst-reg', name: 'GST Registration', category: 'Registration', status: 'pending', description: 'Voluntary registration recommended', priority: 'medium' });
    }
  }

  // PAN Check
  if (profile.panNumber) {
    items.push({ id: 'pan', name: 'PAN Registration', category: 'Registration', status: 'completed', description: 'PAN card obtained', priority: 'high' });
  } else {
    items.push({ id: 'pan', name: 'PAN Registration', category: 'Registration', status: 'missing', description: 'PAN is mandatory for all businesses', priority: 'high' });
  }

  // Udyam / MSME Registration
  if (profile.udyamNumber) {
    items.push({ id: 'udyam', name: 'Udyam/MSME Registration', category: 'Registration', status: 'completed', description: 'MSME registered — eligible for benefits', priority: 'high' });
  } else {
    items.push({ id: 'udyam', name: 'Udyam/MSME Registration', category: 'Registration', status: 'missing', description: 'Free registration — unlocks subsidies & priority lending', priority: 'high' });
  }

  // FSSAI
  if (profile.industryCategory?.toLowerCase().includes('food') || profile.industryCategory?.toLowerCase().includes('restaurant')) {
    if (profile.hasFSSAI) {
      items.push({ id: 'fssai', name: 'FSSAI Food License', category: 'License', status: 'completed', dueDate: getFutureDate(365), description: 'Food safety license — renew annually', priority: 'high' });
    } else {
      items.push({ id: 'fssai', name: 'FSSAI Food License', category: 'License', status: 'missing', description: 'Mandatory for all food businesses', priority: 'high' });
    }
  }

  // Shop Act
  const shopActStates = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Gujarat', 'Rajasthan', 'West Bengal', 'Telangana', 'Andhra Pradesh', 'Uttar Pradesh'];
  if (shopActStates.includes(profile.state)) {
    if (profile.hasShopAct) {
      items.push({ id: 'shop-act', name: 'Shop & Establishment Registration', category: 'License', status: 'completed', dueDate: getFutureDate(365), description: 'Valid registration under state law', priority: 'medium' });
    } else {
      items.push({ id: 'shop-act', name: 'Shop & Establishment Registration', category: 'License', status: 'missing', description: `Required in ${profile.state} for all shops/businesses`, priority: 'medium' });
    }
  }

  // Trade License
  if (profile.hasTradeLicense) {
    items.push({ id: 'trade', name: 'Trade License', category: 'License', status: 'completed', dueDate: getFutureDate(300), description: 'Local body trade license active', priority: 'medium' });
  } else {
    items.push({ id: 'trade', name: 'Trade License', category: 'License', status: 'pending', description: 'Obtain from local municipal authority', priority: 'low' });
  }

  // ITR Filing
  items.push({ id: 'itr', name: 'Income Tax Return (ITR)', category: 'Filing', status: 'pending', dueDate: '2025-07-31', description: 'Annual income tax return filing', priority: 'high' });

  // Professional Tax (state-specific)
  if (['Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Telangana', 'Andhra Pradesh'].includes(profile.state)) {
    items.push({ id: 'pt', name: 'Professional Tax Registration', category: 'Registration', status: 'pending', description: `Mandatory employer registration in ${profile.state}`, priority: 'medium' });
  }

  // ESI/PF if employees > 10
  const empCount = parseInt(profile.employeeCount || '0');
  if (empCount >= 10) {
    items.push({ id: 'esi', name: 'ESI Registration', category: 'Registration', status: 'pending', description: '10+ employees: ESI registration mandatory', priority: 'high' });
  }
  if (empCount >= 20) {
    items.push({ id: 'pf', name: 'PF Registration', category: 'Registration', status: 'pending', description: '20+ employees: PF registration mandatory', priority: 'high' });
  }

  return items;
};

// Smart Alerts
export const generateAlerts = (profile: BusinessProfile, compliances: ComplianceItem[]): SmartAlert[] => {
  const alerts: SmartAlert[] = [];

  const missing = compliances.filter(c => c.status === 'missing');
  const pending = compliances.filter(c => c.status === 'pending' && c.dueDate);

  missing.slice(0, 2).forEach(item => {
    alerts.push({
      id: `missing-${item.id}`,
      type: 'urgent',
      title: `⚠️ ${item.name} Missing`,
      message: item.description,
      actionLabel: 'Take Action',
    });
  });

  pending.slice(0, 2).forEach(item => {
    const daysLeft = getDaysUntil(item.dueDate!);
    alerts.push({
      id: `pending-${item.id}`,
      type: daysLeft <= 7 ? 'urgent' : daysLeft <= 30 ? 'warning' : 'info',
      title: `📅 ${item.name} Due`,
      message: `Due on ${item.dueDate} (${daysLeft} days left)`,
      dueDate: item.dueDate,
      actionLabel: 'View Details',
    });
  });

  if (!profile.udyamNumber) {
    alerts.push({
      id: 'scheme-alert',
      type: 'info',
      title: '💡 Eligible for Mudra Loan',
      message: 'Register on Udyam portal first to unlock loan benefits up to ₹5 Lakhs.',
      actionLabel: 'Register Now',
    });
  }

  return alerts;
};

// Compliance Score
export const calculateComplianceScore = (items: ComplianceItem[]): number => {
  if (!items.length) return 0;
  const weights = { high: 3, medium: 2, low: 1 };
  let total = 0, earned = 0;
  items.forEach(item => {
    const w = weights[item.priority];
    total += w;
    if (item.status === 'completed') earned += w;
  });
  return Math.round((earned / total) * 100);
};

// AI Chat Responses
export const getAIResponse = (message: string, profile: BusinessProfile | null): string => {
  const msg = message.toLowerCase();

  if (msg.includes('gst') && (msg.includes('need') || msg.includes('require') || msg.includes('register'))) {
    const biz = profile?.businessName || 'your business';
    return `**GST Registration for ${biz}:**\n\nGST is mandatory if your annual turnover exceeds:\n- **₹40 Lakhs** for goods businesses\n- **₹20 Lakhs** for service businesses\n- **₹10 Lakhs** for special category states (NE states)\n\n${profile?.gstNumber ? '✅ You already have GST registration!' : '⚠️ Based on your profile, you should register for GST. You can apply online at **gst.gov.in** — takes 3–7 working days.'}\n\nNeed help with the GST registration process?`;
  }

  if (msg.includes('fssai') || msg.includes('food license') || msg.includes('food safety')) {
    return `**FSSAI License — Food Safety Registration:**\n\nFSSAI is **mandatory** for all businesses dealing in food — restaurants, cloud kitchens, bakeries, food manufacturers, etc.\n\n**Types:**\n- **Basic Registration** (turnover < ₹12L) — ₹100/year\n- **State License** (turnover ₹12L–₹20Cr) — ₹2,000–5,000/year\n- **Central License** (turnover > ₹20Cr) — ₹7,500/year\n\n**Apply at:** fssai.gov.in → FoSCoS Portal\n**Documents needed:** PAN, Aadhaar, Business address proof, Food safety plan\n\nWant the step-by-step application guide?`;
  }

  if (msg.includes('mudra') || msg.includes('loan') || msg.includes('funding')) {
    return `**PM Mudra Yojana — Business Loan:**\n\n✅ **You may be eligible** for up to ₹10 Lakhs!\n\n**3 Categories:**\n| Category | Amount | Best For |\n|---|---|---|\n| Shishu | Up to ₹50,000 | New micro businesses |\n| Kishore | ₹50K – ₹5L | Established small biz |\n| Tarun | ₹5L – ₹10L | Expansion projects |\n\n**Key Benefits:** No collateral required, low interest rates (7–12%), quick processing\n\n**How to Apply:**\n1. Visit any public sector bank or Mudra's website\n2. Carry: Aadhaar, PAN, Business proof, 6-month bank statement\n3. Fill loan application + business plan\n\n**Register Udyam first** to strengthen your application!\n\nShall I check your full eligibility based on your profile?`;
  }

  if (msg.includes('udyam') || msg.includes('msme registr')) {
    return `**Udyam/MSME Registration:**\n\n${profile?.udyamNumber ? '✅ You are already Udyam registered!' : '⚠️ You have NOT yet registered on Udyam portal — this is highly recommended!'}\n\n**Benefits of Udyam Registration:**\n- Priority sector bank lending\n- Lower interest rates on loans\n- 50% subsidy on trademark/patent filing\n- Preference in government tenders\n- Protection against delayed payments\n- Access to Mudra loans & PMEGP subsidy\n\n**How to Register (Free & Online):**\n1. Go to **udyamregistration.gov.in**\n2. Enter Aadhaar number\n3. Fill business details (turnover, employees)\n4. Submit — certificate issued instantly!\n\nNo fees, no documents upload needed. Takes 10 minutes!`;
  }

  if (msg.includes('shop act') || msg.includes('shop license') || msg.includes('establishment')) {
    const state = profile?.state || 'your state';
    return `**Shop & Establishment Registration (${state}):**\n\nThis registration is required for **all shops, offices, restaurants, and commercial establishments** in most Indian states.\n\n**Why it's important:**\n- Legal proof of business existence\n- Required to open a business bank account\n- Needed to apply for other licenses\n- Protects employees' rights\n\n**How to apply in ${state}:**\n1. Visit your state's Labour Department portal\n2. Fill Form A with business details\n3. Pay fees (₹500–₹5,000 depending on employee count)\n4. Certificate issued in 1–7 days\n\n**Documents needed:** Owner Aadhaar, PAN, Rent agreement/ownership proof, Business address\n\nRenewal: Usually annual. Do NOT let it lapse!`;
  }

  if (msg.includes('pmegp') || msg.includes('subsidy') || msg.includes('startup scheme')) {
    return `**PMEGP — Prime Minister's Employment Generation Programme:**\n\nA **major government subsidy scheme** for new businesses!\n\n**Subsidy Amount:**\n| Category | Urban | Rural |\n|---|---|---|\n| General | 15% | 25% |\n| SC/ST/OBC/Women/Minority | 25% | 35% |\n\n**Project Limits:**\n- Manufacturing: Up to ₹50 Lakhs\n- Service: Up to ₹20 Lakhs\n\n**Eligibility:**\n- Age 18+ years\n- 8th pass for projects > ₹10L\n- New enterprises only (not expansion)\n\n**Apply at:** kviconline.gov.in/pmegpeportal\n\nThe remaining amount is provided as a bank loan. You only pay back the loan portion!`;
  }

  if (msg.includes('itr') || msg.includes('income tax') || msg.includes('tax return')) {
    return `**Income Tax Return (ITR) for Businesses:**\n\nAll businesses must file ITR annually, regardless of profit or loss.\n\n**Which ITR form?**\n- Proprietorship → ITR-3 or ITR-4 (Presumptive)\n- Partnership/LLP → ITR-5\n- Company → ITR-6\n\n**Key Deadlines:**\n- Non-audit cases: **31 July** every year\n- Audit required cases: **31 October** every year\n- Audit required if turnover > ₹1 Cr (business) or ₹50L (profession)\n\n**Presumptive Taxation (Section 44AD):**\nIf turnover < ₹2 Cr, you can declare 8% of turnover as income (digital transactions: 6%) — no books required!\n\nWant help understanding which form applies to your business?`;
  }

  if (msg.includes('compliance score') || msg.includes('score')) {
    const score = profile ? '76%' : 'N/A';
    return `**Your Compliance Score:**\n\nYour compliance health is calculated based on:\n- ✅ Completed registrations (weighted by priority)\n- ⚠️ Pending filings\n- ❌ Missing mandatory licenses\n\n**Score Ranges:**\n- 🟢 80–100%: Fully Compliant — Excellent!\n- 🟡 60–79%: Partially Compliant — Action needed\n- 🔴 Below 60%: High Risk — Immediate action required\n\nTo improve your score:\n1. Complete Udyam registration (free, 10 min)\n2. Ensure GST filing is up to date\n3. Renew all licenses before expiry\n\nShall I create a priority action plan for you?`;
  }

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('help')) {
    const name = profile?.fullName?.split(' ')[0] || 'there';
    return `Hello ${name}! 👋 I'm your **AI Business Compliance Assistant**.\n\nI can help you with:\n\n📋 **Compliance & Registrations**\n- GST registration & filing\n- MSME/Udyam registration\n- Shop Act, Trade License, FSSAI\n\n💰 **Government Schemes & Loans**\n- Mudra Loan eligibility\n- PMEGP subsidy\n- Startup India benefits\n\n📅 **Deadlines & Reminders**\n- GST filing dates\n- License renewal dates\n- Tax deadlines\n\n🏛️ **State-specific Rules**\n- Rules for ${profile?.state || 'your state'}\n- Industry-specific requirements\n\nWhat would you like to know? You can ask in plain English!`;
  }

  if (msg.includes('state') || msg.includes('rule') || msg.includes('${profile?.state?.toLowerCase()}')) {
    const state = profile?.state || 'your state';
    const rules = stateRules[state] || ['Shop & Establishment Act', 'Local Body Trade License', 'Professional Tax (if applicable)'];
    return `**State-Specific Rules for ${state}:**\n\nIn addition to central laws, ${state} requires:\n\n${rules.map((r, i) => `${i + 1}. **${r}**`).join('\n')}\n\n**Central requirements that apply everywhere:**\n- GST Registration (if turnover threshold crossed)\n- PAN Registration\n- Income Tax Filing\n- MSME/Udyam Registration (recommended)\n\nNeed details on any specific regulation?`;
  }

  // Default response
  const topics = ['GST registration', 'FSSAI license', 'Udyam/MSME registration', 'Mudra loan', 'Shop Act', 'PMEGP subsidy', 'Income Tax filing'];
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  return `I understand you're asking about **"${message}"**.\n\nAs your AI compliance assistant, I'm specialized in Indian MSME compliance. Here are some related topics I can help with:\n\n${topics.slice(0, 5).map(t => `• ${t}`).join('\n')}\n\nCould you rephrase your question, or pick one of the topics above? You can also ask about **${randomTopic}** which is commonly asked by businesses like yours.`;
};

// Helper functions
function getNextMonthDate(day: number): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, day);
  return next.toISOString().split('T')[0];
}

function getFutureDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

// Industry categories list
export const INDUSTRY_CATEGORIES = [
  'Restaurant / Food', 'Manufacturing', 'Retail / Shop', 'IT / Software',
  'Healthcare / Clinic', 'Construction', 'Trading', 'Education',
  'Beauty / Salon', 'Freelancer / Consultant', 'Agriculture', 'Textile',
  'Transport / Logistics', 'Real Estate', 'Finance / NBFC', 'Other',
];

// Indian States list
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];
