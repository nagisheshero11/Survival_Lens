import { NextRequest, NextResponse } from "next/server";
import { getDailyActivityModel } from "@/models/DailyActivity";

// GET /api/mock/weekly?userId=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const DailyActivity = await getDailyActivityModel();
    // Get up to 7 of the most recent activities for the week
    const weeklyActivities = await DailyActivity.find({ userId })
      .sort({ date: -1 })
      .limit(7);

    if (!weeklyActivities || weeklyActivities.length === 0) {
      return NextResponse.json({ error: "Weekly Activity not found" }, { status: 404 });
    }

    // Map the database output to the user's requested JSON structure
    const responseData = weeklyActivities.map(activity => {
      const formattedDate = new Date(activity.date).toISOString().split('T')[0];
      return {
        date: formattedDate,
        ordersCompleted: activity.ordersCompleted,
        earnings: activity.totalEarnings
      };
    });

    // Sort by date ascending to show chronological order
    responseData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Weekly Activity Mock API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
