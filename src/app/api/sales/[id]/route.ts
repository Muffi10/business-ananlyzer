import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Await params in Next.js 15+
    const { id } = await params;
    
    const saleRef = doc(db, "sales", id);
    const saleSnap = await getDoc(saleRef);

    if (!saleSnap.exists()) {
      return NextResponse.json(
        { error: "Sale not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, sale: saleSnap.data() });
  } catch (error: any) {
    console.error("Error fetching sale:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}