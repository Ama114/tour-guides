import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Listing from "@/models/Listing";

// Next.js 15 වල නීතියට අනුව params දැන් Promise එකක්
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    // params එක await කරලා තමයි id එක ගන්න ඕනේ
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    // ඊටපස්සේ ඒ ID එකෙන් ඩේටාබේස් එකේ හොයනවා
    const listing = await Listing.findById(id);
    
    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }
    
    return NextResponse.json(listing, { status: 200 });
  } catch (error) {
    console.log("Error fetching single listing:", error);
    return NextResponse.json({ message: "Failed to fetch listing" }, { status: 500 });
  }
}