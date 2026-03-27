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
    const profile = await WorkerProfile.findOne({ userId });

    if (!profile) {
      return NextResponse.json({ error: "Worker Profile not found" }, { status: 404 });
    }

    const responseData = {
      company: profile.company,
      city: profile.city,
      zone: profile.zone,
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
