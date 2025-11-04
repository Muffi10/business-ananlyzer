import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validate required fields
    const required = ["product_name", "quantity_sold", "actual_price", "sold_price", "payment_mode"];
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    // Calculate profit
    const profit = (data.sold_price - data.actual_price) * data.quantity_sold;

    // Add sale record to Firestore
    const docRef = await addDoc(collection(db, "sales"), {
      product_name: data.product_name,
      quantity_sold: data.quantity_sold,
      actual_price: data.actual_price,
      sold_price: data.sold_price,
      payment_mode: data.payment_mode,
      customer_name: data.customer_name || null,
      timestamp: Timestamp.now(),
      profit: profit,
      listed_status: data.listed_status || "Unlisted",
      remarks: data.remarks || "",
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: any) {
    console.error("Error adding sale:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
