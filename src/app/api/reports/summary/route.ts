import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const salesSnapshot = await getDocs(collection(db, "sales"));
    const expenseSnapshot = await getDocs(collection(db, "expenses"));

    let totalSales = 0;
    let totalProfit = 0;
    let totalExpenses = 0;
    const dailyStats: Record<string, { sales: number; profit: number }> = {};
    const monthlyStats: Record<string, { sales: number; profit: number }> = {};

    // 🧾 Process Sales
    salesSnapshot.forEach((doc) => {
      const sale = doc.data();
      const date = sale.timestamp?.toDate?.() || new Date(sale.timestamp);
      const dayKey = date.toISOString().split("T")[0]; // yyyy-mm-dd
      const monthKey = date.toISOString().slice(0, 7); // yyyy-mm

      const saleTotal = sale.sold_price * sale.quantity_sold;
      const profit = (sale.sold_price - sale.actual_price) * sale.quantity_sold;

      totalSales += saleTotal;
      totalProfit += profit;

      // Daily aggregation
      if (!dailyStats[dayKey]) dailyStats[dayKey] = { sales: 0, profit: 0 };
      dailyStats[dayKey].sales += saleTotal;
      dailyStats[dayKey].profit += profit;

      // Monthly aggregation
      if (!monthlyStats[monthKey]) monthlyStats[monthKey] = { sales: 0, profit: 0 };
      monthlyStats[monthKey].sales += saleTotal;
      monthlyStats[monthKey].profit += profit;
    });

    // 🧾 Process Expenses
    expenseSnapshot.forEach((doc) => {
      const exp = doc.data();
      totalExpenses += exp.amount;
    });

    const netProfit = totalProfit - totalExpenses;

    return NextResponse.json({
      success: true,
      summary: {
        totalSales,
        totalProfit,
        totalExpenses,
        netProfit,
      },
      breakdown: {
        daily: dailyStats,
        monthly: monthlyStats,
      },
    });
  } catch (error: any) {
    console.error("Error generating report:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
