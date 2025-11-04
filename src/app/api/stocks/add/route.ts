import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { product_name, quantity, unit, cost_per_unit } = body;

    if (!product_name || !quantity || !cost_per_unit) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, "stocks"), {
      product_name,
      quantity,
      unit: unit || "meters",
      cost_per_unit,
      created_at: serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: any) {
    console.error("Error adding stock:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
