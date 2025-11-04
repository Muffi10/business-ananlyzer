import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export async function GET() {
  try {
    const salesRef = collection(db, "sales");
    const q = query(salesRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    const sales = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, sales });
  } catch (error: any) {
    console.error("Error fetching sales:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
