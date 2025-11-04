import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { category, description, amount } = body;

    const expenseRef = doc(db, "expenses", params.id);
    await updateDoc(expenseRef, {
      ...(category && { category }),
      ...(description && { description }),
      ...(amount && { amount: parseFloat(amount) }),
    });

    return NextResponse.json({ success: true, message: "Expense updated successfully" });
  } catch (error: any) {
    console.error("Error updating expense:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
