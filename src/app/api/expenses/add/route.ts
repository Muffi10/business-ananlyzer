import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, description, amount } = body;

    if (!category || !amount) {
      return NextResponse.json(
        { error: "Category and amount are required" },
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, "expenses"), {
      category,
      description: description || "",
      amount: parseFloat(amount),
      created_at: serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: any) {
    console.error("Error adding expense:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
