import { NextRequest, NextResponse } from 'next/server';
import Payment from '@/models/Payment';
import connectDB from '@/lib/db';
import { authenticateAdmin } from '@/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();

    // Utilizing $facet to perform multiple aggregations in a single query
    const stats = await Payment.aggregate([
      {
        $facet: {
          totalPaymentsCount: [
            { $count: "count" }
          ],
          totalRevenueSum: [
            { $match: { status: 'success' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
          ]
        }
      }
    ]);

    // Extracting aggregated formats mapping safe defaults
    const totalPayments = stats[0]?.totalPaymentsCount?.[0]?.count || 0;
    const totalRevenue = stats[0]?.totalRevenueSum?.[0]?.total || 0;

    return NextResponse.json({
      totalPayments,
      totalRevenue
    }, { status: 200 });

  } catch (error) {
    console.error('Fetch payments stats error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
