import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Listing from "@/models/Listing";

// .......................................get function.......................................................................
//  use  params  Promise 
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    // await the param and get the id  
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    // find thing in database using id 
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


// ....................................update function............................................................

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const { title, location, imageUrl, description, price } = await req.json();

    await connectToDatabase();
    
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { title, location, imageUrl, description, price },
      { new: true }
    );

    if (!updatedListing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Listing updated successfully" }, { status: 200 });
  } catch (error) {
    console.log("Error updating listing:", error);
    return NextResponse.json({ message: "Failed to update listing" }, { status: 500 });
  }
}





//  ..........................................delete function.................................................

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    await connectToDatabase();
    
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Listing deleted successfully" }, { status: 200 });
  } catch (error) {
    console.log("Error deleting listing:", error);
    return NextResponse.json({ message: "Failed to delete listing" }, { status: 500 });
  }
}