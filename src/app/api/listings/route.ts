import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Listing from "@/models/Listing";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { title, location, imageUrl, description, price, creatorEmail } = await req.json();

    if (!title || !location || !imageUrl || !description || !creatorEmail) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    //  
    const user = await User.findOne({ email: creatorEmail });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ave the new post in database
    const newListing = await Listing.create({
      title,
      location,
      imageUrl,
      description,
      price: price ? Number(price) : 0,
      creator: user._id,
      creatorName: user.name,
    });

    return NextResponse.json({ message: "Listing created successfully" }, { status: 201 });
  } catch (error) {
    console.log("Error creating listing:", error);
    return NextResponse.json({ message: "Failed to create listing" }, { status: 500 });
  }
}


export async function GET() {
  try {
    await connectToDatabase();
    
    // sorted from newest to oldest.
    const listings = await Listing.find().sort({ createdAt: -1 });
    
    return NextResponse.json(listings, { status: 200 });
  } catch (error) {
    console.log("Error fetching listings:", error);
    return NextResponse.json({ message: "Failed to fetch listings" }, { status: 500 });
  }
}