import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Listing from "@/models/Listing";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    const { userEmail } = await req.json();

    if (!userEmail) {
      return NextResponse.json({ message: "User not logged in" }, { status: 401 });
    }

    await connectToDatabase();
    
    const listing = await Listing.findById(id);
    
    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    // --- SAFETY CHECKS FOR OLD POSTS ---
    
    // 1. If this is an old post and doesn't have a 'savedBy' array yet
    if (!listing.savedBy) {
      listing.savedBy = [];
    }

    // 2. NEW FIX: If this is an old post missing the creatorEmail
    // We put the currently logged-in user's email here
    if (!listing.creatorEmail) {
      listing.creatorEmail = userEmail; 
    }
    
    // -----------------------------------

    const hasSaved = listing.savedBy.includes(userEmail);

    if (hasSaved) {
      // If already saved, remove the email (Unlike)
      listing.savedBy = listing.savedBy.filter((email: string) => email !== userEmail);
    } else {
      // If not saved, add the email to the array (Like)
      listing.savedBy.push(userEmail);
    }

    await listing.save();

    return NextResponse.json({ message: "Success", savedBy: listing.savedBy }, { status: 200 });
  } catch (error) {
    console.log("Error saving listing:", error);
    return NextResponse.json({ message: "Failed to save listing" }, { status: 500 });
  }
}