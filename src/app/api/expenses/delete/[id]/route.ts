import { NextResponse } from "next/server";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { app } from "@/lib/firebase";

const db = getFirestore(app);

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Missing expense ID" }, { status: 400 });
    }

    await deleteDoc(doc(db, "expenses", id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
