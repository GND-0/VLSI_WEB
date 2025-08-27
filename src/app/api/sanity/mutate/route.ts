import { NextResponse } from "next/server";
import { client } from "../../../../../lib/sanityClient";

export async function POST(request: Request) {
  try {
    const { id, action } = await request.json();
    if (!id || !action) {
      return NextResponse.json({ error: "Missing id or action" }, { status: 400 });
    }

    let patchResult;
    if (action === "incrementViews") {
      patchResult = await client.patch(id).inc({ views: 1 }).commit();
    } else if (action === "incrementUpvotes") {
      patchResult = await client.patch(id).inc({ upvotes: 1 }).commit();
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: patchResult });
  } catch (error) {
    console.error("Error in mutation:", error);
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
  }
}