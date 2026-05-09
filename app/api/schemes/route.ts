import { getUserFromRequest } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';

// All government schemes database
const ALL_SCHEMES = [
  {
    id: 'pmegp', name: 'PMEGP (Prime Minister\'s Employment Generation Programme)',
    ministry: 'Ministry of MSME / KVIC', category: 'Grant',
    description: 'Subsidy of 15–35% on project cost up to ₹50 lakhs for manufacturing and ₹20 lakhs for service sector. For new businesses only.',
    benefits: ['15–35% capital subsidy', 'Margin money up to ₹17.5 lakhs', 'Bank loan facilitation', 'Training support'],
    applyLink: 'https://www.kviconline.gov.in/pmegpeportal/',
    eligibility: { structures: ['Proprietorship', 'Partnership', 'Society'], minAge: 18, notExisting: true },
    industries: ['all'],
    requiredDocuments: ['Aadhar Card', 'PAN Card', 'Bank Account Details', 'Project Report', 'Caste Certificate (if applicable)'],
  },
  {
    id: 'mudra-shishu', name: 'MUDRA Loan — Shishu (Up to ₹50,000)',
    ministry: 'MUDRA Bank / All Scheduled Banks', category: 'Loan',
    description: 'Collateral-free micro loan up to ₹50,000 for very small and startup businesses.',
    benefits: ['No collateral required', 'Low interest rates', 'Quick disbursal', 'No processing fee'],
    applyLink: 'https://www.mudra.org.in/',
    eligibility: { turnoverMax: '₹10L – ₹40L', structures: ['all'] },
    industries: ['all'],
    requiredDocuments: ['Aadhar Card', 'PAN Card', 'Business Address Proof', 'Bank Statement (6 months)', 'Business Plan'],
  },
  {
    id: 'mudra-kishore', name: 'MUDRA Loan — Kishore (₹50,000 – ₹5 Lakhs)',
    ministry: 'MUDRA Bank / All Scheduled Banks', category: 'Loan',
    description: 'Collateral-free loans for established micro enterprises looking to expand. Low interest rate.',
    benefits: ['Loans from ₹50K to ₹5L', 'No collateral needed', 'Repayment up to 5 years'],
    applyLink: 'https://www.mudra.org.in/',
    eligibility: { structures: ['all'] },
    industries: ['all'],
    requiredDocuments: ['Aadhar Card', 'PAN Card', 'Bank Statement (6 months)', 'IT Returns', 'Business Address Proof'],
  },
  {
    id: 'mudra-tarun', name: 'MUDRA Loan — Tarun (₹5L – ₹10 Lakhs)',
    ministry: 'MUDRA Bank / All Scheduled Banks', category: 'Loan',
    description: 'Loans for growing small businesses needing ₹5–10 lakhs for expansion or working capital.',
    benefits: ['Loans up to ₹10 lakhs', 'Flexible repayment', 'Competitive interest rates'],
    applyLink: 'https://www.mudra.org.in/',
    eligibility: { structures: ['all'] },
    industries: ['all'],
    requiredDocuments: ['Aadhar Card', 'PAN Card', 'GST Certificate', 'Balance Sheet', 'Bank Statement (12 months)', 'IT Returns'],
  },
  {
    id: 'cgtmse', name: 'CGTMSE (Credit Guarantee Fund for MSEs)',
    ministry: 'Ministry of MSME / SIDBI', category: 'Loan',
    description: 'Collateral-free loans up to ₹200 lakhs with government guarantee for existing MSEs.',
    benefits: ['Collateral-free credit up to ₹200L', '85% guarantee cover', 'Both term loan and working capital'],
    applyLink: 'https://www.cgtmse.in/',
    eligibility: { registered: ['udyam'], structures: ['all'] },
    industries: ['Manufacturing', 'Services', 'Retail'],
    requiredDocuments: ['Udyam Certificate', 'GST Certificate', 'Bank Statement (12 months)', 'Project Report', 'Balance Sheet'],
  },
  {
    id: 'udyam', name: 'Udyam Registration (Free MSME Status)',
    ministry: 'Ministry of MSME', category: 'Registration',
    description: 'Free government MSME registration that unlocks priority lending, subsidies, and scheme access. Takes 10 minutes.',
    benefits: ['Priority sector lending', 'Subsidy on patents & barcodes', 'Preference in government tenders', 'Protection against delayed payments'],
    applyLink: 'https://udyamregistration.gov.in/',
    eligibility: { notRegistered: ['udyam'], structures: ['all'] },
    industries: ['all'],
    requiredDocuments: ['Aadhar Card', 'PAN Card', 'GSTIN (if applicable)'],
  },
  {
    id: 'standup-india', name: 'Stand-Up India (SC/ST & Women)',
    ministry: 'SIDBI / Department of Financial Services', category: 'Loan',
    description: 'Bank loans of ₹10 lakhs to ₹1 crore for SC/ST and women entrepreneurs setting up Greenfield enterprises.',
    benefits: ['Loans ₹10L to ₹1Cr', 'Composite loan (term + working capital)', 'Subsidized rates'],
    applyLink: 'https://www.standupmitra.in/',
    eligibility: { gender: ['female'], structures: ['all'] },
    industries: ['Manufacturing', 'Services', 'Trading'],
    requiredDocuments: ['Aadhar Card', 'PAN Card', 'SC/ST Certificate or Gender Proof', 'Project Report', 'Business Plan'],
  },
  {
    id: 'startup-india', name: 'Startup India — DPIIT Recognition',
    ministry: 'DPIIT / Ministry of Commerce', category: 'Registration',
    description: 'Official startup recognition giving tax exemptions (3 years), faster patent processing, and fund access.',
    benefits: ['3-year income tax exemption', '80% rebate on patent fees', 'Self-certification for 6 labour laws', 'Access to Startup India Fund'],
    applyLink: 'https://www.startupindia.gov.in/',
    eligibility: { ageMax: 10, structures: ['Pvt Ltd', 'LLP', 'Partnership'] },
    industries: ['Technology', 'Services', 'Manufacturing'],
    requiredDocuments: ['Incorporation Certificate', 'PAN Card', 'Pitch Deck', 'DPIIT Registration Form'],
  },
  {
    id: 'gst-composition', name: 'GST Composition Scheme',
    ministry: 'GST Council', category: 'Registration',
    description: 'Pay GST at a fixed 1–5% rate on turnover instead of complex monthly filings. For businesses below ₹1.5 Cr turnover.',
    benefits: ['Reduced compliance burden', 'Lower tax rate (1–5%)', 'Quarterly filing instead of monthly', 'No ITC but simple bookkeeping'],
    applyLink: 'https://www.gst.gov.in/',
    eligibility: { turnoverMax: '₹1 Cr – ₹5 Cr', registered: ['gst'] },
    industries: ['Manufacturing', 'Retail', 'Restaurant'],
    requiredDocuments: ['GST Registration Certificate', 'Bank Account Details'],
  },
  {
    id: 'fssai', name: 'FSSAI Food License',
    ministry: 'Food Safety and Standards Authority of India', category: 'Registration',
    description: 'Mandatory license for food businesses. Basic registration for turnover < ₹12L, State for ₹12L–₹20Cr, Central above.',
    benefits: ['Legal compliance', 'Builds consumer trust', 'Mandatory for food retail/manufacturing'],
    applyLink: 'https://foscos.fssai.gov.in/',
    eligibility: {},
    industries: ['Food & Beverage', 'Restaurants', 'FMCG', 'Agriculture & Agro-processing'],
    requiredDocuments: ['Aadhar Card', 'PAN Card', 'Address Proof of Premises', 'Form B', 'Blueprint of premises'],
  },
  {
    id: 'gem-portal', name: 'GeM Portal (Government e-Marketplace)',
    ministry: 'Ministry of Commerce', category: 'Registration',
    description: 'Sell products/services directly to government departments. Huge market for MSMEs with guaranteed payments.',
    benefits: ['Access to ₹2 lakh crore government procurement market', 'Direct payment in 10 days', 'Zero commission for MSMEs', 'Digital storefront'],
    applyLink: 'https://gem.gov.in/',
    eligibility: { registered: ['udyam'] },
    industries: ['Manufacturing', 'IT & Technology', 'Services', 'Retail', 'Trading'],
    requiredDocuments: ['Udyam Certificate', 'GST Certificate', 'PAN Card', 'Bank Account Details', 'Product/Service Details'],
  },
  {
    id: 'pli', name: 'PLI Scheme (Production Linked Incentive)',
    ministry: 'Ministry of Commerce & Industry', category: 'Subsidy',
    description: 'Financial incentives of 4–20% on incremental sales for manufacturers in 14 key sectors.',
    benefits: ['4–20% incentive on incremental sales', 'Covers 14 sectors', 'Creates jobs', 'Boosts exports'],
    applyLink: 'https://dpiit.gov.in/schemes',
    eligibility: { structures: ['Pvt Ltd', 'LLP'] },
    industries: ['Manufacturing', 'Pharmaceuticals', 'Electronics & Technology', 'Textile & Apparel', 'Automobiles'],
    requiredDocuments: ['Company Registration Certificate', 'GST Certificate', 'Financial Statements (3 years)', 'Project Report'],
  },
];

function scoreScheme(scheme: typeof ALL_SCHEMES[0], profile: Record<string, unknown>): number {
  let score = 40; // base

  const industry = (profile.industryCategory as string) || '';
  const structure = (profile.businessStructure as string) || '';
  const turnover  = (profile.annualTurnover as string) || '';
  const gst       = profile.gstNumber as string;
  const udyam     = profile.udyamNumber as string;

  // Industry match
  if (scheme.industries.includes('all') || scheme.industries.some(i => industry.toLowerCase().includes(i.toLowerCase()))) {
    score += 30;
  } else {
    score -= 10;
  }

  // Udyam boost
  if (udyam && scheme.eligibility.registered?.includes('udyam')) score += 20;
  if (!udyam && scheme.id === 'udyam') score += 35; // strongly recommend

  // GST match
  if (gst && scheme.eligibility.registered?.includes('gst')) score += 15;

  // Structure match
  const el = scheme.eligibility as Record<string, unknown>;
  if (el.structures && Array.isArray(el.structures)) {
    if ((el.structures as string[]).includes('all') || (el.structures as string[]).includes(structure)) score += 10;
    else score -= 5;
  }

  // Registration schemes — boost if not already registered
  if (scheme.category === 'Registration' && scheme.id === 'udyam' && !udyam) score += 20;

  // Clamp
  return Math.max(20, Math.min(99, score));
}

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Fetch user's business profile
    const db = await getDb();
    const profile = await db.collection('profiles').findOne({ userId: user.userId }) as Record<string, unknown> | null;

    // Score schemes based on profile
    const scored = ALL_SCHEMES.map(s => ({
      ...s,
      eligibilityScore: profile ? scoreScheme(s, profile) : 60,
    })).sort((a, b) => b.eligibilityScore - a.eligibilityScore);

    return Response.json({ schemes: scored });
  } catch (err) {
    console.error('[schemes]', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
