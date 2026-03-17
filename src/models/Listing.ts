import mongoose, { Schema } from "mongoose";

// Define the structure of our database table (Schema)
const ListingSchema = new Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, default: 0 },
    creatorEmail: { type: String, required: true },
    creatorName: { type: String }, // Optional, depending on your auth setup

    // --- New Favorites/Wishlist Field Starts Here ---
    savedBy: { 
      type: [String], // This tells MongoDB to store an array of email strings
      default: []     // When a new post is created, it starts with 0 likes (empty array)
    },
    // --- New Favorites/Wishlist Field Ends Here ---
  },
  { 
    timestamps: true // This automatically adds 'createdAt' and 'updatedAt' times
  }
);

// Prevent Next.js from recompiling the model every time we refresh the page
const Listing = mongoose.models.Listing || mongoose.model("Listing", ListingSchema);

export default Listing;