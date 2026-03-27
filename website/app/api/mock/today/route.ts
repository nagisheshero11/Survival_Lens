import { NextRequest, NextResponse } from "next/server";
import { getDailyActivityModel } from "@/models/DailyActivity";

// GET /api/mock/today?userId=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const DailyActivity = await getDailyActivityModel();
    // Assuming today's record will have the most recent date
    const todayActivity = await DailyActivity.findOne({ userId }).sort({ date: -1 });

    if (!todayActivity) {
      return NextResponse.json({ error: "Today's Activity not found" }, { status: 404 });
    }

    // Helper to format date cleanly as "YYYY-MM-DD"
    const formattedDate = new Date(todayActivity.date).toISOString().split('T')[0];

    const responseData = {
      date: formattedDate,
      hoursWorked: todayActivity.hoursWorked,
      activeTime: todayActivity.activeTime,
      ordersAssigned: todayActivity.ordersAssigned,
      ordersAccepted: todayActivity.ordersAccepted,
      ordersCompleted: todayActivity.ordersCompleted,
      ordersCancelled: todayActivity.ordersCancelled,
      baseEarnings: todayActivity.baseEarnings,
      incentives: todayActivity.incentives,
      tips: todayActivity.tips,
      totalEarnings: todayActivity.totalEarnings,
      surgeMultiplier: todayActivity.surgeMultiplier,
      weather: todayActivity.weather
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Today Activity Mock API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
