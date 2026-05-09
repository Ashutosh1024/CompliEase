import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Authorization,Content-Type' };
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: CORS }); }

// GET /api/extension/profile — returns business profile data for extension autofill
export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });


  const db = await getDb();
  const profile = await db.collection('profiles').findOne({ userId: user.userId });

  if (!profile) return NextResponse.json({ profile: null });

  // Return structured data for form filling (no internal Mongo fields)
  return NextResponse.json({
    profile: {
      fullName:          profile.fullName,
      email:             profile.email || user.email,
      mobile:            profile.mobile,
      businessName:      profile.businessName,
      businessType:      profile.businessType,
      industryCategory:  profile.industryCategory,
      businessStructure: profile.businessStructure,
      natureOfBusiness:  profile.natureOfBusiness,
      gstNumber:         profile.gstNumber,
      panNumber:         profile.panNumber,
      udyamNumber:       profile.udyamNumber,
      cinNumber:         profile.cinNumber,
      state:             profile.state,
      district:          profile.district,
      address:           profile.address,
      pinCode:           profile.pinCode,
      annualTurnover:    profile.annualTurnover,
      employeeCount:     profile.employeeCount,
      yearEstablished:   profile.yearEstablished,
      hasTradeLicense:   profile.hasTradeLicense,
      hasFSSAI:          profile.hasFSSAI,
      hasShopAct:        profile.hasShopAct,
    }
  });
}
