import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const saleRef = doc(db, "sales", params.id);
    await deleteDoc(saleRef);

    return NextResponse.json({ success: true, message: "Sale deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting sale:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
