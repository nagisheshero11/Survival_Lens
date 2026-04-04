import { NextRequest, NextResponse } from "next/server";
import { getWorkerProfileModel } from "@/models/WorkerProfile";

// GET /api/mock/profile?userId=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const WorkerProfile = await getWorkerProfileModel();
    const profile = await WorkerProfile.findOne({
      $or: [{ partnerId: userId }, { userId }]
    });

    if (!profile) {
      return NextResponse.json({ error: "Worker Profile not found" }, { status: 404 });
    }

    const avgWeeklyIncome = Number(
      profile.avgWeeklyIncome ??
      ((typeof profile.avgDailyIncome === 'number' ? profile.avgDailyIncome : 0) * 7)
    ) || 0;

    const avgWorkingHours = Number(
      profile.avgWorkingHours ??
      ((typeof profile.workingHoursPerDay === 'number' ? profile.workingHoursPerDay : 0) *
        (typeof profile.workingDaysPerWeek === 'number' ? profile.workingDaysPerWeek : 7))
    ) || 0;

    const responseData = {
      company: profile.company,
      partnerId: profile.partnerId || profile.userId,
      city: profile.city,
      zone: profile.zone,
      avgWeeklyIncome: Math.round(avgWeeklyIncome),
      avgWorkingHours: Math.round(avgWorkingHours),
      workingHoursPerDay: profile.workingHoursPerDay,
      workingDaysPerWeek: profile.workingDaysPerWeek,
      avgOrdersPerDay: profile.avgOrdersPerDay,
      avgEarningPerOrder: profile.avgEarningPerOrder,
      avgDailyIncome: profile.avgDailyIncome,
      acceptanceRate: profile.acceptanceRate,
      completionRate: profile.completionRate,
      rating: profile.rating
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Profile Mock API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
