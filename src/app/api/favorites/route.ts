import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb"; // Adjust this path if your db connection file is elsewhere
import Listing from "@/models/Listing";

// This tells Next.js: "Do not cache this API, always fetch fresh data from MongoDB"
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    // Extract the user's email from the URL (e.g., /api/favorites?email=nimal@gmail.com)
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await connectToDatabase();

    // THE MAGIC QUERY: Find all posts where the 'savedBy' array contains this exact email
    // .sort({ createdAt: -1 }) will show the newest posts first
    const favoriteListings = await Listing.find({ savedBy: email }).sort({ createdAt: -1 });

    return NextResponse.json(favoriteListings, { status: 200 });
  } catch (error) {
    console.log("Error fetching favorites:", error);
    return NextResponse.json({ message: "Failed to fetch favorites" }, { status: 500 });
  }
}