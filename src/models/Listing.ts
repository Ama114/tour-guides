import mongoose, { Schema, models } from "mongoose";

const listingSchema = new Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number },  
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },  
    creatorName: { type: String, required: true }, 
  },
  { timestamps: true } // Automatically creates the time the post was posted (createdAt)
);

const Listing = models.Listing || mongoose.model("Listing", listingSchema);

export default Listing;