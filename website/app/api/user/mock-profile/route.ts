import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/middleware/auth";
import { getWorkerProfileModel } from "@/models/WorkerProfile";

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error }, 
        { status: authResult.status || 401 }
      );
    }

    const user = authResult.user!;

    // Extract the partner ID (Worker ID)
    let partnerId = null;
    let companyName = "";
    
    if (user.kyc && user.kyc.companies && user.kyc.companies.length > 0) {
      // Prioritize verified companies if available
      const targetCompany = user.kyc.companies.find(c => c.verified && c.partnerId) || user.kyc.companies[0];
      partnerId = targetCompany.partnerId;
      companyName = targetCompany.company;
    }

    if (!partnerId) {
      return NextResponse.json(
        { error: "No Worker ID linked to this account. Please complete KYC." }, 
        { status: 404 }
      );
    }

    // Fetch generated worker metrics from company DB.
    const WorkerProfile = await getWorkerProfileModel();
    const mockProfile = await WorkerProfile.findOne({
      $or: [{ partnerId }, { userId: partnerId }]
    });

    if (!mockProfile) {
      return NextResponse.json(
        { error: `Mock profile not found for Worker ID: ${partnerId}` }, 
        { status: 404 }
      );
    }

    const avgWeeklyIncome = Number(
      mockProfile.avgWeeklyIncome ??
      ((typeof mockProfile.avgDailyIncome === 'number' ? mockProfile.avgDailyIncome : 0) * 7)
    ) || 0;

    const avgWorkingHours = Number(
      mockProfile.avgWorkingHours ??
      ((typeof mockProfile.workingHoursPerDay === 'number' ? mockProfile.workingHoursPerDay : 0) *
        (typeof mockProfile.workingDaysPerWeek === 'number' ? mockProfile.workingDaysPerWeek : 7))
    ) || 0;

    // Return the fetched Mock DB data cleanly
    return NextResponse.json({
      mockProfile: {
        company: mockProfile.company || companyName,
        partnerId: mockProfile.partnerId || partnerId,
        city: mockProfile.city,
        zone: mockProfile.zone,
        avgWeeklyIncome: Math.round(avgWeeklyIncome),
        avgWorkingHours: Math.round(avgWorkingHours),
        workingHoursPerDay: mockProfile.workingHoursPerDay,
        workingDaysPerWeek: mockProfile.workingDaysPerWeek,
        avgOrdersPerDay: mockProfile.avgOrdersPerDay,
        avgEarningPerOrder: mockProfile.avgEarningPerOrder,
        avgDailyIncome: mockProfile.avgDailyIncome,
        acceptanceRate: mockProfile.acceptanceRate,
        completionRate: mockProfile.completionRate,
        rating: mockProfile.rating
      },
      userDetails: {
        fullName: user.fullName,
        accountLevel: "Pro" // hardcoded for the demo UI
      }
    }, { status: 200 });

  } catch (error) {
    console.error("User Mock Profile API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}
