import { NextRequest, NextResponse } from "next/server";
import { getMockCompanyModel } from "@/models/MockCompanyData";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, partnerId } = body;

    // 1. Validation and Safeguards
    if (!companyName || !partnerId) {
      return NextResponse.json(
        { success: false, error: "Company name and Partner ID are required" },
        { status: 400 }
      );
    }

    // Connect to database and get model
    const MockCompanyData = await getMockCompanyModel();

    // 2. Fetch data from DB
    // Use case-insensitive matching for the company name
    const companyData = await MockCompanyData.findOne({ 
      companyName: new RegExp(`^${companyName}$`, 'i'), 
      partnerId 
    });

    if (!companyData) {
      return NextResponse.json(
        { success: false, error: "Partner ID not found in company records" },
        { status: 404 }
      );
    }

    // 3. Return Processed Metrics
    const metrics = {
      avgWeeklyIncome: companyData.avgWeeklyIncome,
      avgWorkingHours: companyData.avgWorkingHours,
      avgDeliveries: companyData.avgDeliveries,
      companyVerified: true,
      platform: companyData.companyName,
      retrievedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: metrics
    }, { status: 200 });

  } catch (error) {
    console.error("Mock Company API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error during data retrieval" },
      { status: 500 }
    );
  }
}
