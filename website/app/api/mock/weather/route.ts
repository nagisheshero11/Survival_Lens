import { NextRequest, NextResponse } from "next/server";
import { getClimateDataModel } from "@/models/ClimateData";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");

    if (!city) {
      return NextResponse.json({ error: "city parameter is required" }, { status: 400 });
    }

    const ClimateData = await getClimateDataModel();
    
    // Perform a case-insensitive exact match so "mumbai", "Mumbai", or "MUMBAI" will all match correctly.
    const climateProfile = await ClimateData.findOne({ 
      city: { $regex: new RegExp(`^${city.trim()}$`, 'i') } 
    });

    if (!climateProfile) {
      return NextResponse.json({ error: `Climate data not found for city: ${city}` }, { status: 404 });
    }

    const responseData = {
      city: climateProfile.city,
      avgTemperature: climateProfile.avgTemperature,
      avgRainfallMm: climateProfile.avgRainfallMm,
      floodRiskIndex: climateProfile.floodRiskIndex,
      historicalDisruptions: climateProfile.historicalDisruptions,
      calculatedRiskMultiplier: climateProfile.calculatedRiskMultiplier,
      retrievedAt: new Date().toISOString()
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Weather Mock API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
