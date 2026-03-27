import { NextRequest, NextResponse } from "next/server";

// GET /api/mock/disruption?city=...&zone=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || "Hyderabad";
    const zone = searchParams.get("zone") || "Madhapur";

    // Since disruptions don't have a Mongo Schema provided by the user, 
    // we make the output deterministic based on city and zone strings using a simple hash.
    const combinedString = `${city.toLowerCase()}-${zone.toLowerCase()}`;
    let hash = 0;
    for (let i = 0; i < combinedString.length; i++) {
      hash = combinedString.charCodeAt(i) + ((hash << 5) - hash);
    }
    const absHash = Math.abs(hash);

    // Some deterministic variations
    const types = ["rain", "heatwave", "strike", "traffic", "pollution"];
    const type = types[absHash % types.length];
    
    const severities = ["low", "medium", "high", "critical"];
    const severity = severities[(absHash % 4)];
    
    // Impact level from 0.4 to 0.9 depending on hash
    const impactLevel = parseFloat((0.4 + ((absHash % 50) / 100)).toFixed(1));
    
    // Drop in orders between 20 to 80
    const expectedDropInOrders = 20 + (absHash % 61);

    const responseData = {
      type,
      severity,
      impactLevel,
      expectedDropInOrders
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Disruption Mock API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
