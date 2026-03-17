import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Listing from "@/models/Listing";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    // Extract all data sent from the frontend request body
    const { title, location, imageUrl, description, price, creatorEmail } = await req.json();

    // Validate if all required fields are provided
    if (!title || !location || !imageUrl || !description || !creatorEmail) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    // Find the user in the database to link them to this listing
    const user = await User.findOne({ email: creatorEmail });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Create and save the new listing in the database
    const newListing = await Listing.create({
      title,
      location,
      imageUrl,
      description,
      price: price ? Number(price) : 0,
      creator: user._id,
      creatorName: user.name,
      creatorEmail: creatorEmail, // Added the missing field required by the database schema
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
    
    // Fetch all listings and sort them from newest to oldest
    const listings = await Listing.find().sort({ createdAt: -1 });
    
    return NextResponse.json(listings, { status: 200 });
  } catch (error) {
    console.log("Error fetching listings:", error);
    return NextResponse.json({ message: "Failed to fetch listings" }, { status: 500 });
  }
}