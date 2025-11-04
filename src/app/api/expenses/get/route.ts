import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export async function GET() {
  try {
    const q = query(collection(db, "expenses"), orderBy("created_at", "desc"));
    const querySnapshot = await getDocs(q);
    const expenses = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, expenses });
  } catch (error: any) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
