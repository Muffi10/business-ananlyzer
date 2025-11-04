import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Await params in Next.js 15+
    const { id } = await params;
    
    const stockRef = doc(db, "stocks", id);
    await deleteDoc(stockRef);

    return NextResponse.json({ success: true, message: "Stock deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting stock:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}